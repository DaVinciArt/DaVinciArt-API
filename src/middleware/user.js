import {UserRepository} from "../Repositories/UserRepository.js";
import {createTokens} from "./auth.js";

export async function updateUser(req, res){
    const user = (await UserRepository.update({id:req.params.userId}, req.body)).dataValues
    console.log(user)
    if(user){
        const token = createTokens(user,res)
        return res.status(201).json({accessToken: token})
    }
    return res.status(401).send('Cannot update user');
}
export async function deleteUser(req, res){
    const id = req.body.userId
    if(await UserRepository.delete({id})) return res.status(201).send('Deleted successfully');
    return res.status(404).send('Cannot delete this user');
}
export async function getUserByQuery(req,res){
    const user = await UserRepository.getDataValue(req.body);
    return res.status(201).json(user);
}