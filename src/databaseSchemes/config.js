
import {Sequelize} from 'sequelize';
import {fileURLToPath} from "url";
import path from "path";
import dotenv from "dotenv";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.resolve(__dirname, '../config/.env') })

export const sequelize = new Sequelize('DaVinci',process.env.POSTGRE_USERNAME,process.env.POSTGRE_PASS, {
    host: process.env.POSTGRE_HOST,
    dialect: 'postgres',
    logging: false
})
