import {Collection, Painting} from "../databaseSchemes/dataScheme.js";

export class CollectionRepository {
    static async create(body) {
        const deconstructedBody = {...body, paintings : [{...body.paintings, upload_date: body.upload_date}]};

        deconstructedBody.paintings = deconstructedBody.paintings.flatMap(item => {
            return Object.keys(item).filter(key => key !== 'upload_date').map(key => {
                const painting = item[key];
                return { ...painting, upload_date: item.upload_date };
            });
        });
        console.log(`Body: \n${JSON.stringify(deconstructedBody)}`)
        let collection;
        try {
            collection = await Collection.create({
                ...deconstructedBody
            });
            console.log(`Body: \n${JSON.stringify({
                collection_id: collection.id,
                ...deconstructedBody.paintings[0],
                image_url: deconstructedBody.image_url
            })}`)
            for (let i =0;i<deconstructedBody.paintings.length;i++){
                try{
                    await Painting.create({
                        collection_id: collection.id,
                        ...deconstructedBody.paintings[i],
                        image_url: deconstructedBody.paintings[i].image_url
                    })
                }catch(err){
                    console.log(err)
                }
            }
        }
        catch (err)
            {
                console.log(err);
            }

        console.log('Collection: ')
        console.log(collection.dataValues)
        return collection.dataValues;
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

    static async getByPopularity(page = 1, limit = 5){
        const offset = (page-1)*limit
        return await Collection.findAll({
            where:{
                on_sale: true
            },
            order:[['views', 'DESC']],
            limit:limit,
            offset:offset,
        })
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

    static async searchDV(conditions = {}, model = Painting, optionalVars = {}) {
        let collection = {};
        console.log({...conditions})
        try {
            collection = await Collection.findOne({
                where: {...conditions},
                include: [{
                    model:model
                }]
            })
            if(conditions.author_id !== optionalVars.id){
                collection.views+=1
                await collection.save()
            }
        } catch(err) {
            console.log(err)
            console.log('Cannot find collection with this credentials');
            return null;
        }
        if (!collection){
            return null;
        }
        return collection.dataValues;
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
        return collection.dataValues;
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
        console.log(dbResponse)
        for (const collection in dbResponse){
            console.log(collection)
            result.push(dbResponse[collection].dataValues)
        }
        console.log(result)
        return result
    }
}