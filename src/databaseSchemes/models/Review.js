import {DataTypes, Model} from "sequelize";
import {User} from "./User.js";

export class Review extends Model {
    static initModel(sequelize) {

        Review.init({
            id: {
                type: DataTypes.INTEGER,
                autoIncrement: true,
                primaryKey: true
            },
            commentator_id: {
                type: DataTypes.INTEGER,
                references:{
                    model: User,
                    key: 'id'
                },
                allowNull: false
            },
            receiver_id: {
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
            comment_text: {
                type: DataTypes.TEXT,
                allowNull: false
            },
        }, {
            sequelize,
            modelName: 'Review', timestamps: false
        })

    }
}