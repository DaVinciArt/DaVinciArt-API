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


    static async getDataValue(body, include=[]){
        let user = {};
        try {
            console.log({...body})
            user = await User.findOne({
                where:{...body},
                include: include
            })
        } catch(err) {
            console.log(err)
            console.log('Cannot find user with this parameters');
            return null;
        }
        if (!user){
            return null;
        }
        console.log({...user})
        return user.dataValues;
    }

    static async getEntity(body, include=[]){
        let dbResponse = {};
        try {
            console.log({...body})
            dbResponse = await User.findOne({
                where:{...body},
                include: include
            })
        } catch(err) {
            console.log(err)
            console.log('Cannot find user with this parameters');
            return null;
        }
        if (!dbResponse){
            return null;
        }
        console.log({...dbResponse})
        return dbResponse;
    }

    static async delete(body) {
        let user = this.getDataValue(body);
        if (!user) return false;
        await User.destroy({
            where:{
                ...body
            }
        });
        return true;
    }

    static async update(searchBody, updatedBody) {

        const user = await this.getDataValue({...searchBody});
        if (!user) return null;
        return (await User.update({...updatedBody},{
            where:{
                ...searchBody
            },
            returning: true
        }))[1][0]
    }
}