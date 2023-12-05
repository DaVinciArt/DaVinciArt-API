import {User} from "../databaseSchemes/dataScheme.js";


export class UserRepository {
    static async create(body) {
        const deconstructedBody = {...body};
        console.log({...deconstructedBody})
        let user;
        try {
            user = await User.build({
                ...deconstructedBody
            });
        } catch (err) {
            console.log(err);
        }
        console.log('USER: ')
        console.log(user.dataValues)
        await user.save();
        return user.dataValues;
    }


    static async getUserByNameOrId(username, id = undefined) {
        return (await this.search({username, id}));
    }
    static async getUserById(id,attributes){
        let user = {};
        try {
            user = await User.findOne({
                where: {
                    id
                },
                attributes: attributes
            })
        } catch {
            console.log('Cannot find user with such username');
            return null;
        }
        if (!user){
            return null;
        }
        return user.dataValues;
    }

    static async getUserByName(name){
        let user = {};
        try {
            user = await User.findOne({
                where: {
                    username:name
                }
            })
        } catch {
            console.log('Cannot find user with such username');
            return null;
        }
        if (!user){
            return null;
        }
        return user.dataValues;
    }

    static async delete(username) {
        let user = this.search(username);
        if (!user) return false;
        await User.destroy({
            where:{
                username:username
            }
        });
        return true;
    }

    static async update(username, updatedBody) {

        let user = await this.search(username);
        if (!user) return null;
        return await User.update({...updatedBody},{
            where:{
                username: username
            }
        })
    }

    static async search(username) {
        let user = {};
        try {
            user = await User.findOne({
                where: {
                    username: username
                }
            })
        } catch {
            console.log('Cannot find user with such username');
            return null;
        }
        if (!user){
            return null;
        }
        return user.dataValues;
    }
}