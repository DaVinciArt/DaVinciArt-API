import {Router} from "express";
import {register} from "../middleware/auth.js"
import {getAllComments} from "../middleware/review.js";
export const reviewRouter = Router();

reviewRouter.post('/sendReview',register);
reviewRouter.get('/:userId/getAll', getAllComments)