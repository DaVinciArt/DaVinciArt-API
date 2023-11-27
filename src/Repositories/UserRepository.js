import {User} from "../databaseSchemes/dataScheme.js";
import {Op} from "sequelize";

export class UserRepository {
    static async create(body) {
        const deconstructedBody = {...body};
        let user;
        try {
            user = await User.build({
                deconstructedBody
            });
        } catch (err) {
            console.log(err);
        }
        await user.save();
        return user;
    }


    static async getUserByNameOrId(username, id = undefined) {
        return (await this.search(username, id));
    }

    static async delete(username) {
        let user = this.search(username);
        if (!user) return false;
        await user.destroy();
        return true;
    }

    static async update(username, updatedBody) {

        const user = this.search(username);
        if (!user) return false;
        const deconstructedBody = {...updatedBody};

        user.update({
            deconstructedBody
        })
        return true;
    }

    static async search(username, id) {
        const conditions = [];
        if (id !== undefined) {
            conditions.push({ id });
        }
        if (username !== undefined) {
            conditions.push({ username });
        }
        let user = {};
        try {
            user = await User.findOne({
                where: {
                    [Op.or]: conditions
                }
            })
        } catch {
            console.log('Cannot find user with such username');
            return null;
        }
        return user.dataValues;
    }
}