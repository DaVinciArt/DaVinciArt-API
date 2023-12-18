import {Collection, Painting} from "../databaseSchemes/dataScheme.js";
import * as log from 'log';
export class CollectionRepository {

    static DEFAULT_PAGE = 1;
    static DEFAULT_LIMIT = 5;
    static ON_SALE = true;
    static MODEL = Painting;

    static async create(body) {
        const extendedBody = this.extendBodyWithUploadDate(body);

        let collection;
        try {
            collection = await Collection.create(extendedBody);
            await this.createPaintingForAll(collection.id, extendedBody.paintings);
        } catch (err) {
            this.logError(err);
        }

        return collection.dataValues;
    }

    static async createPaintingForAll(collectionId, paintings){
        for (let i = 0; i < paintings.length; i++){
            await this.createSinglePainting(collectionId, paintings[i]);
        }
    }

    static async createSinglePainting(collectionId, painting){
        try {
            await this.createPainting(collectionId, painting);
        } catch (err) {
            this.logError(err);
        }
    }

    static extendBodyWithUploadDate(body) {
        const extendedBody = {...body, paintings : [{...body.paintings, upload_date: body.upload_date}]};
        extendedBody.paintings = extendedBody.paintings.flatMap(item => this.transformPainting(item));

        return extendedBody;
    }

    static transformPainting(item) {
        return Object.keys(item).filter(key => key !== 'upload_date').map(key => {
            const painting = item[key];
            return { ...painting, upload_date: item.upload_date };
        });
    }

    static createPainting(collectionId, painting) {
        return Painting.create({
            collection_id: collectionId,
            ...painting,
            image_url: painting.image_url
        });
    }


    static async getCollectionByUserId(userId){
        return await this.searchForAll(userId)

    }

    static async delete(id) {
        let collection = this.searchDV({id});
        if (!collection) return false;
        await collection.destroy();
        return true;
    }

    static async getWithOffset(page = this.DEFAULT_PAGE, limit = this.DEFAULT_LIMIT, searchParams = {}){
        const offset = (page-1)*limit;
        return await Collection.findAll({
            where:{
                ...searchParams,
                on_sale: this.ON_SALE
            },
            order:[['views', 'DESC']],
            limit:limit,
            offset:offset,
        });
    }
    static async update(id, updatedBody) {

        const collection = await this.searchDV({id: id});
        if (!collection) return null;
        await Collection.update({...updatedBody},{
            where:{
                id
            },
        })
        return await this.searchWithInclude(id)
    }

    static async searchDV(conditions = {}, model = this.MODEL, optionalVars = {}) {
        try {
            let collection = await this.findCollectionWithModel(conditions, model);
            await this.incrementViewsIfRequired(collection, conditions, optionalVars)

            return collection.dataValues;
        } catch(err) {
            this.logError(err);
            return null;
        }
    }

    static async findCollectionWithModel(conditions, model) {
        return await Collection.findOne({
            where: {...conditions},
            include: [{
                model: model
            }]
        });
    }

    static async incrementViewsIfRequired(collection, conditions, optionalVars){
        const authorId = +conditions.author_id;
        const authorIDfromJWT = +optionalVars.id;

        if(authorIDfromJWT!==authorId){
            collection.views+=1;
            await collection.save();
        }
    }

    static async searchEntity(conditions = {}, includes = []) {
        let collection = {};
        try {
            collection = await Collection.findOne({
                where: {...conditions},
                include: includes
            })
        } catch {
            console.log('Cannot find collection with this credentials');
            return null;
        }
        if (!collection){
            return null;
        }
        return collection;
    }
    static async searchWithInclude(id) {
        let collection = {};
        try {
            collection = await Collection.findOne({
                where:{
                    id:id
                },
                include: [{
                model: Painting,
                }]
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
    static async searchForAll(author_id) {
        let result = []
        let dbResponse = {}
        try {
            dbResponse = await Collection.findAll({
                where: {
                    author_id
                },
                include: [{
                    model: Painting,
                }]
            })
        } catch {
            console.log('Cannot find collection with this credentials');
            return null;
        }
        if (!dbResponse){
            return null;
        }
        for (const collection in dbResponse){
            result.push(dbResponse[collection].dataValues)
        }
        return result

    }
    static logError(err) {
        log.error(err);
        log.warn('Cannot find collection with this credentials');
    }

}