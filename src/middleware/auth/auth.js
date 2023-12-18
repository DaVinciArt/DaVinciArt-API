import bcrypt from 'bcrypt'
import {UserRepository} from "../../Repositories/UserRepository.js";
import cloudinary from '../../index.js'
import * as fs from "fs";

import {JWTService} from './JwtService.js';


export async function verifyEmail(req,res){

}
export async function register(req,res){
        let avatar = ' '
        const path = req.file.path;
        if (path) {
                const result = await cloudinary.uploader.upload(path, {folder:"avatars/"});
                fs.unlink(path, (err) => {
                    if (err) console.error("Error deleting temp file", err);
                });
                avatar = result.secure_url;
        }
        const {username, password} = req.body;
        if(username && password){
            const userExists = await UserRepository.getDataValue({username})
            if(userExists) return res.status(404).send('Username already exists')
            const registerBody = {
                ...req.body,
                password: hashPassword(password),
                balance: 0,
                avatar: avatar
            }
            const user = (await UserRepository.create(registerBody))

            if (!user) res.status(404).send('Cannot create user')

            console.log(`${username} was saved to the Database`)
            console.log({...user})
            const token = createTokens(user, res)
            return res.status(201).json({accessToken: token})
        }
        else{
            return res.status(404).send('Cannot register')
        }
}

export async function login(req, res){
    const {username, password} = req.body;
    console.log(!username)
    if(!username || !password) return res.status(401).send('Cannot authorise')
    if(req.session.user) return res.status(201).send('Already logged in')

    let user = await UserRepository.getDataValue({username});

    if(!user) return res.status(401).send('Invalid username')

    return checkPassword(password, user, res)

}


export function refresh(req,res){
    const {refreshToken} = req.body;
    if(!refreshToken) res.status(401).send('Access Denied: No token provided!');
    try {
        const user = JWTService.verifyRefreshToken(refreshToken);
        const accessToken = JWTService.generateAccessToken(user);
        return res.json({ accessToken: accessToken });
    } catch (error) {
        return res.status(403).send('Invalid Refresh Token');
    }
}

export function createTokens(user, res){
    const accessToken = JWTService.generateAccessToken(user);
    const refreshToken = JWTService.generateRefreshToken(user);
    res.cookie('refreshToken', refreshToken, {
        httpOnly: true,
        secure: false,
        sameSite: 'Strict',
        maxAge: 3600000
    });
    return accessToken;
}
function hashPassword(password){
    const salt = bcrypt.genSaltSync();
    return bcrypt.hashSync(password,salt)
}
function comparePassword(raw, hash){
    return bcrypt.compare(raw, hash);
}

async function checkPassword(inputPassword, dbUser, res){
    const isValid = await comparePassword(inputPassword,dbUser.password)
    if(isValid){
        const accessToken = createTokens(dbUser, res);
        console.log(`User ${dbUser.username} logged in at ${new Date(Date.now()).toUTCString()}`);
        return res.status(200).json({ accessToken: accessToken });
    }
    else {
        console.log(`User ${dbUser.username} tried to log in at ${new Date(Date.now()).toISOString()}`);
        return res.status(401).send('Invalid password');

    }
}

export async function changePassword(req, res){
    const user = await UserRepository.update({password: hashPassword(req.body.password)})
    if(user)
        return res.status(201).json({accessToken: createTokens(user,res)});
    return res.status(404).send('Cannot update password');
}

export function filterUserForToken(user){
    const {iat, exp, createdAt, updatedAt, ...rest} = user;
    return rest;
}