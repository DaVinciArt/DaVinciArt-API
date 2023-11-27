import {sequelize} from './databaseSchemes/dataScheme.js';
import express from "express";
import {authRouter} from "./routes/authRouter.js";
import {userRouter} from './routes/userRouter.js';
import session from "express-session";
import {authToken} from "./middleware/auth.js";
import passport from "passport";
import dotenv from 'dotenv';
import {paintingsRouter} from "./routes/painting.js";
import cookieParser from 'cookie-parser';
import {v2 as cloudinary} from 'cloudinary';

dotenv.config();
cloudinary.config({
    cloud_name: 'dncmx4fay',
    api_key: '816764534661459',
    api_secret: '***************************'
});


try {
    await sequelize.authenticate();
    console.log('Connection has been established successfully.');
} catch (error) {
    console.error('Unable to connect to the databaseSchemes:', error);
}

sequelize.sync({ force: false }).then(() => {
    console.log('Models are synced with the database');
});

const app = express();

const PORT = process.env.PORT;

app.use(express.json());
app.use(express.urlencoded());
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
    next();
});
app.use('/auth', authRouter);
app.use('/user/collections', authToken, paintingsRouter);
app.use('/user', authToken, userRouter);

app.listen(PORT, ()=> console.log(`Running server on ${PORT}`));



