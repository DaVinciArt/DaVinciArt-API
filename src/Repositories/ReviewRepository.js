import {Review, User} from "../databaseSchemes/dataScheme.js";


export class ReviewRepository {
    static async create(userId, body) {
        const deconstructedBody = {...body, receiver_id: userId};
        console.log(deconstructedBody)
        let review;
        try {
            review = await Review.create({
                ...deconstructedBody
            });
        } catch (err) {
            console.log(err);
            return null
        }
        return review.dataValues;
    }


    static async getAll(userId){
        return await Review.findAll({
            where: {
                receiver_id: userId
            },
            include: [
                {
                    model: User,
                    as: 'commentator',
                    attributes: ['id', 'username', 'avatar']
                }
            ]
        })
    }

    static async delete(body) {
        try {
            const result = await Review.destroy({
                where: {
                    ...body
                }
            });
        }catch(err){
            console.log(err)
            return false
        }
        return true;
    }

    static async updateText(id, body) {

        const review = await this.search({id});
        if (!review) return null;
        return (await Review.update({...body},{
            where:{
                id: id
            },
            returning: true
        }))[1][0]
    }

    static async search(body) {
        let review = {};
        try {
            review = await Review.findOne({
                where: {
                    ...body
                }
            })
        } catch {
            console.log('Cannot find review with this id');
            return null;
        }
        if (!review){
            return null;
        }
        return review.dataValues;
    }
}