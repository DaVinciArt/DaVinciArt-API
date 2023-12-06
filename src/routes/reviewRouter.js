import {Router} from "express";
import {addComment, deleteComment, editComment, getAllComments} from "../middleware/review.js";
export const reviewRouter = Router();

reviewRouter.post('/sendReview/:userId',addComment);
reviewRouter.get('/:userId/getAll', getAllComments)
reviewRouter.delete('/:reviewId/delete',deleteComment)
reviewRouter.put('/:reviewId/edit',editComment)