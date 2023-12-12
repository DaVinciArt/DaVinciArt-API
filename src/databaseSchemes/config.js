
import {Sequelize} from 'sequelize';
import {POSTGRE_HOST, POSTGRE_PASS, POSTGRE_USERNAME} from "../GLOBALS.js";

export const sequelize = new Sequelize('DaVinci',POSTGRE_USERNAME,POSTGRE_PASS, {
    host: POSTGRE_HOST,
    dialect: 'postgres',
    logging: false
})
