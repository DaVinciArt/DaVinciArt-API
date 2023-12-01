import {DataTypes, Model} from "sequelize";
import {Sequelize} from 'sequelize';
import {fileURLToPath} from "url";
import path from "path";
import dotenv from "dotenv";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.resolve(__dirname, '../config/.env') })

const sequelize = new Sequelize('DaVinci',process.env.POSTGRE_USERNAME,process.env.POSTGRE_PASS, {
    host: process.env.POSTGRE_HOST,
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
            status: {
                type: DataTypes.ENUM('selling', 'on hold'),
                allowNull: false,
            },
            price: {
                type: DataTypes.FLOAT,
                allowNull: false
            }
        },{sequelize,
            modelName: 'Collection'});

export class Painting extends Model {}
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
    modelName: 'Painting'});

export class Purchase extends Model {}
Purchase.init({
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    buyer_id: {
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
    purchase_time: {
        type: DataTypes.DATE,
        allowNull: false
    }
},{sequelize,
    modelName: 'Transaction'});

User.Comments = User.hasMany(Review, {
    foreignKey: 'commentator_id',
    as: 'commentator'
});
User.Reviews = User.hasMany(Review, {
    foreignKey: 'receiver_id',
    as: 'receiver'
})
User.Collections = User.hasMany(Collection, {
    foreignKey: 'author_id'
})
User.Purchases = User.hasMany(Purchase,{
    foreignKey:'purchase_id'
})
Purchase.Collection = Purchase.hasOne(Collection,{
    foreignKey:'collection_id'
})
Collection.Paintings = Collection.hasMany(Painting,{
    foreignKey: 'collection_id'
})
Painting.Collection = Painting.belongsTo(Collection)
Review.Receiver = Review.belongsTo(User, {foreignKey: 'receiver_id', as: 'receiver'})
Review.Commentator = Review.belongsTo(User, {foreignKey:'commentator_id', as: 'commentator'})
Collection.User = Collection.belongsTo(User)
Collection.Purchase = Collection.belongsTo(Purchase)

export {sequelize}