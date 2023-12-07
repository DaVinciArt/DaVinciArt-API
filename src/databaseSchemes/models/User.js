import {DataTypes, Model} from "sequelize";

export class User extends Model {
    static initModel(sequelize){
        User.init({
            id: {
                type: DataTypes.INTEGER,
                autoIncrement: true,
                primaryKey: true
            },
            username: {
                type: DataTypes.TEXT,
                allowNull: false,
                unique: true
            },
            first_name: {
                type: DataTypes.TEXT,
                allowNull: false
            },
            last_name: {
                type: DataTypes.TEXT,
                allowNull: false
            },
            avatar: {
                type: DataTypes.TEXT,
                allowNull: false
            },
            email: {
                type: DataTypes.TEXT,
                allowNull: false,
                unique: true
            },
            password: {
                type: DataTypes.TEXT,
                allowNull: false,
            },
            balance: {
                type: DataTypes.FLOAT,
                allowNull: false
            }
        }, {sequelize, modelName: 'User', timestamps: false})

    }
}