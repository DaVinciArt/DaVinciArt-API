import {DataTypes, Model} from "sequelize";
import {Collection} from "./Collection.js";

export class Painting extends Model {
    static initModel(sequelize){
        Painting.init({
            id: {
                type: DataTypes.INTEGER,
                autoIncrement: true,
                primaryKey: true
            },
            name: {
                type: DataTypes.TEXT,
                allowNull: false
            },
            collection_id: {
                type: DataTypes.INTEGER,
                references:{
                    model: Collection,
                    key: 'id'
                },
                allowNull: false
            },
            upload_date: {
                type: DataTypes.TEXT,
                allowNull: false
            },
            image_url: {
                type: DataTypes.TEXT,
                allowNull: false
            }
        },{sequelize,
            modelName: 'Painting', timestamps: false})


    }
}