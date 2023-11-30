import {Collection, Painting} from "../databaseSchemes/dataScheme.js";
import {Op} from "sequelize";

export class CollectionRepository {
    static async create(body, paintings) {
        const deconstructedBody = {...body};
        console.log(`Body: \n${{...deconstructedBody}}`)
        let collection;
        try {
            collection = await Collection.create({
                ...deconstructedBody,
                paintings:paintings,
            },{
                include:[Painting]
            });
        } catch (err) {
            console.log(err);
        }
        console.log('Collection: ')
        console.log(collection)
        return collection.dataValues;
    }


    static async getCollectionByNameOrId(name, id = undefined) {
        return (await this.search(name, id));
    }

    static async delete(id) {
        let collection = this.search(null,id);
        if (!collection) return false;
        await collection.destroy();
        return true;
    }

    static async update(username, updatedBody) {

        const collection = this.search(username);
        if (!collection) return false;
        const deconstructedBody = {...updatedBody};

        collection.update({
            deconstructedBody
        })
        return true;
    }

    static async search(name, id, authorId) {
        const conditions = [];
        if (id !== undefined) {
            conditions.push({ id });
        }
        if(authorId !== undefined){
            conditions.push({authorId})
        }
        if (name !== undefined) {
            conditions.push({ name: name });
        }
        let collection = {};
        try {
            collection = await Collection.findOne({
                where: {
                    [Op.or]: conditions
                }
            })
        } catch {
            console.log('Cannot find collection with this credentials');
            return null;
        }
        if (!collection){
            return null;
        }
        return collection.dataValues;
    }
}