import {authRoute} from "./authRouter.js";
import {collectionRoute} from "./collectionRouter.js";
import {userRoute} from "./userRouter.js";
import {userCollectionRoute} from "./userCollectionRouter.js";
import {paymentRoute} from "./paymentRouter.js";
import {reviewRoute} from "./reviewRouter.js";
import {Router} from "express";
import {authToken} from '../handlers/authToken.js'

const router = Router();
const authRoutes = ['user','reviews','payment']

    const controllers = [
        authRoute,
        collectionRoute,
        userRoute,
        userCollectionRoute,
        paymentRoute,
        reviewRoute
    ]
    controllers.forEach((route) => {
        Object.entries(route).forEach(([path, {method, middleware, handler}]) =>{
            checkIfAuthPath(path, middleware)
            const config = [path, ...(middleware ? [middleware] : []), handler]
            router[method.toLowerCase()](...config);
        })
    });

    function checkIfAuthPath(path, middleware){
        if(authRoutes.some(element => element === path.split('/')[1]))
            return middleware.push(authToken)
        if (!middleware) middleware = []
        return middleware
    }
export default router