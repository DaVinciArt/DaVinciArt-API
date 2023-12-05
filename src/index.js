import {sequelize} from './databaseSchemes/config.js';
import express from "express";
import {authRouter} from "./routes/authRouter.js";
import {userRouter} from './routes/userRouter.js';
import session from "express-session";
import {authToken} from "./handlers/authToken.js";
import passport from "passport";
import dotenv from 'dotenv';
import {userCollectionRouter} from "./routes/userCollectionRouter.js";
import cookieParser from 'cookie-parser';
import {v2 as cloudinary} from 'cloudinary';
import {reviewRouter} from "./routes/review.js";
import {paymentRouter} from "./routes/paymentRouter.js";
import {entryParamExports} from "./handlers/userIdParamHandle.js";
import {collectionRouter} from "./routes/collectionRouter.js";


process.on('unhandledRejection', (error) => {
    console.log('Unhandled Promise Rejection:', error);
    process.exit(1); // Optional: exit the process after logging the error
});
dotenv.config();
cloudinary.config({
        cloud_name: process.env.CLOUDINARY_NAME,
        api_key: process.env.CLOUDINARY_API,
        api_secret: process.env.CLOUDINARY_SECRET,
        debug: true
    });

export default cloudinary
try {
    await sequelize.authenticate();
    console.log('Connection has been established successfully.');
} catch (error) {
    console.error('Unable to connect to the databaseSchemes:', error);
}

try{
    sequelize.sync({alter: true}).then(() => {
        console.log('Models are synced with the database');
    });
}catch (err){
    console.log(err)
}



const app = express();

const PORT = process.env.PORT;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(passport.initialize({}));

app.use(
    session({
        secret: process.env.SESSION_SECRET,
        resave: false,
        saveUninitialized: false
    })
);
app.use((req,res,next) =>
{
    console.log(`${req.method}:${req.url} from ${req.ip} ${req.hostname}`);
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
    res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    if (req.method === 'OPTIONS') {
    res.sendStatus(200);
    } else {
        next();
    }
})
app.use('/auth', authRouter);
app.use('/user', authToken, userRouter);
app.use('/user/:userId/collection', authToken,entryParamExports, userCollectionRouter)
app.use('/collection', collectionRouter)
app.use('/reviews',authToken,reviewRouter)
app.use('/payment',authToken, paymentRouter)

app.listen(PORT, ()=> console.log(`Running server on ${PORT}`));
