import {DataTypes, Model} from "sequelize";
import {User} from "./User.js";

export class Collection extends Model {
    static initModel(sequelize){
        Collection.init({
            id: {
                type: DataTypes.INTEGER,
                autoIncrement: true,
                primaryKey: true
            },
            name: {
                type: DataTypes.TEXT,
                allowNull: false
            },
            author_name:{
                type: DataTypes.TEXT,
                allowNull: false
            },
            views:{
                type: DataTypes.INTEGER,
                allowNull: true
            },
            author_id: {
                type: DataTypes.INTEGER,
                references:{
                    model: User,
                    key: 'id'
                },
                allowNull: false
            },
            upload_date: {
                type: DataTypes.TEXT,
                allowNull: false
            },
            preview_image_url: {
                type: DataTypes.TEXT,
                allowNull: false
            },
            tags: {
                type: DataTypes.ARRAY(DataTypes.TEXT),
                allowNull: false
            },
            onSale: {
                type: DataTypes.BOOLEAN,
                allowNull: false,
                defaultValue: false
            },
            price: {
                type: DataTypes.FLOAT,
                allowNull: false
            }
        },{sequelize,
            modelName: 'Collection', timestamps: false})

    }
}
