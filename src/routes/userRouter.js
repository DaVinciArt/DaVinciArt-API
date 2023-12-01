import {Router} from "express";
import {getUserByQuery, deleteUser, updateUser} from "../middleware/user.js";
import {addComment, getAllComments} from "../middleware/review.js";
import {changePassword} from "../middleware/auth.js";
import {uploadAny} from "../middleware/fileUpload.js";
import {createCollection} from "../middleware/collection.js";

export const userRouter = Router();

userRouter.get('/get/:id?',getUserByQuery);
userRouter.post('/delete',deleteUser);
userRouter.post('/update',updateUser);
userRouter.post('changePassword',changePassword);

userRouter.get('/:userId/getAllComments', getAllComments)
userRouter.post('/:userId/comment', addComment)