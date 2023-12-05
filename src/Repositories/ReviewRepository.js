import {Review, User} from "../databaseSchemes/dataScheme.js";


export class ReviewRepository {
    static async create(userId, body) {
        const deconstructedBody = {...body, receiver_id: userId};
        console.log(deconstructedBody)
        let review;
        try {
            review = await Review.build({
                ...deconstructedBody

            });
        } catch (err) {
            console.log(err);
        }
        await review.save();
        return review.dataValues;
    }


    static async getAllReviews(userId){
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

    static async delete(id) {
        let review = this.search(id);
        if (!review) return false;
        await review.destroy();
        return true;
    }

    static async updateText(id, text) {

        const review = this.search(id);
        if (!review) return false;

        review.update({
            text
        })
        return true;
    }

    static async search(id) {
        let review = {};
        try {
            review = await Review.findOne({
                where: {
                    id
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