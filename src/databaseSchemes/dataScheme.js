import  {sequelize} from "./config.js";
import {User} from "./models/User.js";
import {Collection} from "./models/Collection.js";
import {Painting} from "./models/Painting.js";
import {Review} from "./models/Review.js";
import {Purchase} from "./models/Purchase.js";


User.initModel(sequelize);
Review.initModel(sequelize);
Collection.initModel(sequelize);
Purchase.initModel(sequelize);
Painting.initModel(sequelize);

Collection.hasMany(Painting, {foreignKey: 'collection_id'})
Collection.belongsTo(User, {foreignKey: 'author_id'})
Collection.hasOne(Purchase, {foreignKey: 'collection_id'})

Painting.belongsTo(Collection, {foreignKey: 'collection_id'})

Purchase.belongsTo(Collection,{foreignKey:'collection_id'})
Purchase.belongsTo(User, {foreignKey: 'buyer_id', as: 'buyer'})
Purchase.belongsTo(User, {foreignKey: 'seller_id', as: 'seller'})

Review.belongsTo(User, {foreignKey: 'receiver_id', as: 'receiver'})
Review.belongsTo(User, {foreignKey:'commentator_id', as: 'commentator'})

User.hasMany(Review, {
    foreignKey: 'commentator_id',
    as: 'commentator'
});
User.hasMany(Review, {
    foreignKey: 'receiver_id',
    as: 'receiver'
})
User.hasMany(Collection, {
    foreignKey: 'author_id'
})
User.hasMany(Purchase,{
    foreignKey:'buyer_id',
    as: 'purchases'
})

export {User, Collection, Purchase, Painting, Review}