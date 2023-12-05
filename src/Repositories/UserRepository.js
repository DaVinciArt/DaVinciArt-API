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


    static async getUserWithParams(body, include=[]){
        let user = {};
        try {
            user = await User.findOne({
                where:{...body},
                include: include,
                returning:true
            })
        } catch(err) {
            console.log(err)
            console.log('Cannot find user with this parameters');
            return null;
        }
        if (!user){
            return null;
        }
        return user.dataValues;
    }

    static async delete(username) {
        let user = this.getUserWithParams({username});
        if (!user) return false;
        await User.destroy({
            where:{
                username:username
            }
        });
        return true;
    }

    static async update(username, updatedBody) {

        let user = await this.getUserWithParams({username});
        if (!user) return null;
        return (await User.update({...updatedBody},{
            where:{
                username: username
            },
            returning: true
        }))[1][0]
    }
}