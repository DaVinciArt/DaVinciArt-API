import {sequelize} from './databaseSchemes/config.js';
import express from "express";
import session from "express-session";
import passport from "passport";
import dotenv from 'dotenv';
import cookieParser from 'cookie-parser';
import {v2 as cloudinary} from 'cloudinary';
import swaggerUi from "swagger-ui-express";
import YAML from 'yamljs';
import {initHandling} from "./handlers/handleOption.js";
import router from "./routes/MainRouter.js";
import {exec} from "node:child_process"
import {CLOUDINARY_API, CLOUDINARY_NAME, CLOUDINARY_SECRET, PORT, SESSION_SECRET} from './GLOBALS.js'

process.on('unhandledRejection', (error) => {
    console.log('Unhandled Promise Rejection:', error);
    process.exit(1); 
});
dotenv.config();
cloudinary.config({
        cloud_name: CLOUDINARY_NAME,
        api_key: CLOUDINARY_API,
        api_secret: CLOUDINARY_SECRET,
        debug: true
    });

export default cloudinary


try {
    sequelize.authenticate().then(() =>{
        console.log('Connection has been established successfully.')
    })
    sequelize.sync({alter: true}).then(() => {
        console.log('Models are synced with the database');
    });
} catch (error) {
    console.error('Unable to connect to the databaseSchemes:', error);
}

const app = express();

app.use(
    (initHandling),
    express.json(),
    express.urlencoded({ extended: true }),
    cookieParser(),
    passport.initialize({}),
    session({
        secret: SESSION_SECRET,
        resave: false,
        saveUninitialized: false
    }),
    router
);
const swaggerDocument = YAML.load('./swagger.yaml');
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

app.listen(PORT, async ()=> {
    console.log(`Running server on ${PORT}`);
    exec(`start http://localhost:${PORT}/api-docs`)

});
