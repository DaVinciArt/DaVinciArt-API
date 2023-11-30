import {Router} from "express";
import {login, refresh, register} from "../middleware/auth.js";
import {uploadSingle} from '../middleware/fileUpload.js'
export const authRouter = Router();

authRouter.post('/sendReview', uploadSingle,register);
authRouter.post('/login',login);
authRouter.post('/refresh',refresh);