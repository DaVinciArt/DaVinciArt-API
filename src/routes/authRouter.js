import {Router} from "express";
import {login, refresh, register} from "../middleware/auth.js";

export const authRouter = Router();

authRouter.post('/register',register);
authRouter.post('/login',login);
authRouter.post('/refresh',refresh);