import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
import {UserRepository} from "../Repositories/UserRepository.js";
import cloudinary from '../index.js'
import * as fs from "fs";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.resolve(__dirname, '../config/.env') })
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
            const userExists = await UserRepository.getUserByNameOrId(username)
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

    let user = await UserRepository.getUserByName(username);

    if(!user) return res.status(401).send('Invalid username')

    return checkPassword(password, user, res)

}

export function refresh(req,res){
    const {refreshToken} = req.body;
    if(!refreshToken) res.status(401).send('Access Denied: No token provided!');
    try {
        const user = jwt.verify(refreshToken, process.env.REFRESH_SECRET);

        const accessToken = jwt.sign(user, process.env.SECRET, { expiresIn: '1h' });

        res.json({ accessToken: accessToken });
    } catch (error) {
        res.status(403).send('Invalid Refresh Token');
    }
}

function createTokens(user, res){
    const user_Token = filterUserForToken(user)
    const accessToken = jwt.sign(user_Token, process.env.SECRET, { expiresIn: '1h'})
    const refreshToken = jwt.sign(user_Token, process.env.REFRESH_SECRET)
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
export function authToken(req,res,next){
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];
    if(token == null) return res.sendStatus(401);

    jwt.verify(token, process.env.SECRET, (err, user) => {
        if(err) return res.sendStatus(403);
        req.user = user;
        next();
    })

}
export async function changePassword(req, res){
    if(await UserRepository.update({password: hashPassword(req.body.password)}))
        return res.status(201).send('Updated successfully');
    return res.status(404).send('Cannot update password');
}

export function filterUserForToken(user){
    const {iat, exp, createdAt, updatedAt, ...rest} = user;
    return rest;
}