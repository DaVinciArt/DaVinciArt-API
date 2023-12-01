import {Router} from "express";
import {login, refresh, register, verifyEmail} from "../middleware/auth.js";
import {uploadSingle} from '../middleware/fileUpload.js'
export const authRouter = Router();

authRouter.post('/register', uploadSingle,register);
authRouter.post('/login',login);
authRouter.post('/refresh',refresh);
authRouter.post('/verifyEmail',verifyEmail)