import {Router} from "express";
import {getUserByQuery, deleteUser, updateUser, getUser} from "../middleware/user.js";
import {addComment, getAllComments} from "../middleware/review.js";
import {changePassword} from "../middleware/auth.js";

export const userRouter = Router();

userRouter.get('/get',getUserByQuery);
userRouter.delete('/:userId/delete',deleteUser);
userRouter.put('/:userId/update',updateUser);
userRouter.put('/:userId/update',updateUser);
userRouter.get('/:userId', getUser)

userRouter.post('changePassword',changePassword);

userRouter.get('/:userId/getAllComments', getAllComments)
userRouter.post('/:userId/comment', addComment)