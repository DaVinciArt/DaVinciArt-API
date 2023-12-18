import {login, refresh, register, verifyEmail} from "../middleware/auth/auth.js";
import {uploadSingle} from '../middleware/fileUpload.js'

export const authRoute = {
    '/auth/register':{
        method: 'POST',
        middleware:[uploadSingle],
        handler:register
    },
    '/auth/login':{
        method: 'POST',
        handler:login
    },
    '/auth/refresh':{
        method: 'POST',
        handler:refresh
    },
    '/auth/verifyEmail':{
        method: 'POST',
        handler:verifyEmail
    }
}