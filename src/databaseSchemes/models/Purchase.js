import {DataTypes, Model} from "sequelize";
import {Collection} from "./Collection.js";
import {User} from "./User.js";

export class Purchase extends Model {
    static initModel(sequelize) {

        Purchase.init({
            id: {
                type: DataTypes.INTEGER,
                autoIncrement: true,
                primaryKey: true
            },
            purchase_time: {
                type: DataTypes.DATE,
                allowNull: false
            },
            buyer_id: {
                type: DataTypes.INTEGER,
                references:{
                    model: User,
                    key: 'id'
                },
                allowNull: false
            },
            seller_id: {
                type: DataTypes.INTEGER,
                references:{
                    model: User,
                    key: 'id'
                },
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
        }, {
            sequelize,
            modelName: 'Transaction', timestamps: false
        })

    }
}