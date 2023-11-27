import {DataTypes, Model} from "sequelize";
import {Sequelize} from 'sequelize';

const sequelize = new Sequelize('DaVinci','postgres','greenbaby2014', {
    host: 'localhost',
    dialect: 'postgres',
    logging: false
})

export class User extends Model {}
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
                type: DataTypes.BLOB,
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
                type: DataTypes.INTEGER,
                allowNull: false
            }
        },{sequelize,
            modelName: 'User'});
export class Review extends Model {}
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
            rate:{
                type: DataTypes.SMALLINT
            }
        },{sequelize,
            modelName: 'Review'});

export class Collection extends Model {}
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
            preview_picture: {
                type: DataTypes.TEXT,
                allowNull: false
            },
            tags: {
                type: DataTypes.ARRAY(DataTypes.TEXT),
                allowNull: false
            },
            status: {
                type: DataTypes.ENUM('selling', 'on hold'),
                allowNull: false,
            },
            price: {
                type: DataTypes.INTEGER,
                allowNull: false
            }
        },{sequelize,
            modelName: 'Collection'});


User.hasMany(Review, {
    foreignKey: 'commentator_id'
});
User.hasMany(Review, {
    foreignKey: 'receiver_id'
})
User.hasMany(Collection, {
    foreignKey: 'author_id'
})
Review.belongsTo(User)
Collection.belongsTo(User)

export {sequelize}