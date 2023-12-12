import {addComment, deleteComment, editComment, getAllComments} from "../middleware/review.js";
export const reviewRoute = {
    '/reviews/sendReview/:userId':{
        method:'POST',
        middleware:[],
        handler: addComment
    },
    '/reviews/:userId/getAll':{
        method:'GET',
        middleware:[],
        handler: getAllComments
    },
    '/reviews/:reviewId/delete':{
        method:'DELETE',
        middleware:[],
        handler: deleteComment
    },
    '/reviews/:reviewId/edit':{
        method:'PUT',
        middleware:[],
        handler: editComment
    },
}