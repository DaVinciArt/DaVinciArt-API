import jwt from 'jsonwebtoken';
import {JWTSECRET, REFRESH_SECRET} from "../../GLOBALS.js";

export class JWTService {
    static generateAccessToken(user) {
        const user_Token = this.filterUserForToken(user);
        return jwt.sign(user_Token, JWTSECRET, { expiresIn: '1h' });
    }

    static generateRefreshToken(user) {
        const user_Token = this.filterUserForToken(user);
        return jwt.sign(user_Token, REFRESH_SECRET);
    }

    static verifyRefreshToken(token) {
        try {
            return jwt.verify(token, REFRESH_SECRET);
        } catch (error) {
            throw new Error('Invalid Refresh Token');
        }
    }

    static filterUserForToken(user){
        const {iat, exp, createdAt, updatedAt, ...rest} = user;
        return rest;
    }

}
