import {getUserByQuery, deleteUser, updateUser, getUser} from "../middleware/user.js";
import {addComment, getAllComments} from "../middleware/review.js";
import {changePassword} from "../middleware/auth/auth.js";

export const userRoute = {
    '/user/get':{
        method:'GET',
        middleware:[],
        handler: getUserByQuery
    },
    '/user/:userId/delete':{
        method:'DELETE',
        middleware:[],
        handler: deleteUser
    },
    '/user/:userId/update':{
        method:'PUT',
        middleware:[],
        handler: updateUser
    },
    '/user/:userId':{
        method:'GET',
        middleware:[],
        handler: getUser
    },
    '/user/changePassword':{
        method:'POST',
        middleware:[],
        handler: changePassword
    },
    '/user/:userId/getAllComments':{
        method:'GET',
        middleware:[],
        handler: getAllComments
    },
    '/user/:userId/comment':{
        method:'POST',
        middleware:[],
        handler: addComment
    }
}