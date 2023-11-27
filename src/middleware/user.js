import {UserRepository} from "../Repositories/UserRepository.js";


export async function updateUser(req, res){
    if(await UserRepository.update(req.body.username,req.body)){
        return res.status(201).send('Updated user successfully');
    }
    return res.status(401).send('Cannot update user');
}
export async function deleteUser(req, res){
    if(await UserRepository.delete(req.body.username)) return res.status(201).send('Deleted successfully');
    return res.status(404).send('Cannot delete this user');
}
export async function getUserByQuery(req,res){
    const username = req.params.username;
    const id = req.params.id;
    const user = await UserRepository.getUserByNameOrId(username, id);
    return res.status(201).json(user);
}