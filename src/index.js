import {sequelize} from './databaseSchemes/dataScheme.js';
import express from "express";
import {authRouter} from "./routes/authRouter.js";
import {userRouter} from './routes/userRouter.js';
import session from "express-session";
import {authToken} from "./middleware/auth.js";
import passport from "passport";
import dotenv from 'dotenv';
import {collectionRouter} from "./routes/collectionRouter.js";
import cookieParser from 'cookie-parser';
import {v2 as cloudinary} from 'cloudinary';

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

sequelize.sync({ alter: false }).then(() => {
    console.log('Models are synced with the database');
});

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

app.listen(PORT, ()=> console.log(`Running server on ${PORT}`));


