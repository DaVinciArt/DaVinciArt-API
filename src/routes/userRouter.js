import {Router} from "express";
import {getUserByQuery, deleteUser, updateUser} from "../middleware/user.js";
import {changePassword} from "../middleware/auth.js";

export const userRouter = Router();

userRouter.post('/delete',deleteUser);
userRouter.post('/update',updateUser);
userRouter.get('/get/:id?',getUserByQuery);
userRouter.post('changePassword',changePassword);