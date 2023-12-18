import {CollectionRepository} from "../Repositories/CollectionRepository.js";
import {UserRepository} from "../Repositories/UserRepository.js";
import {createTokens} from "./auth/auth.js";

export async function buyCollection(req,res){
    const buyer = await UserRepository.getEntity({id: req.body.buyer_id})
    const seller = await UserRepository.getEntity({id: req.body.seller_id})
    const collectionId = req.params.collectionId;
    const collection = await CollectionRepository.searchEntity({id:collectionId})
    if(buyer.balance < collection.price) return res.status(400).send({message:'Not enough money'})
    console.log({...seller})
    console.log({...buyer})
    console.log({...collection})
    collection.author_id = req.body.buyer_id
    collection.author_name = buyer.username
    buyer.balance= buyer.balance - collection.price
    seller.balance= seller.balance + collection.price
    console.log(collection.author_name)
    try {
        await buyer.save()
        await seller.save()
        await collection.save()
    }catch(err){
        console.log(err)
        return res.status(404).send({message: 'Payment error'})
    }
    const dbUser = await UserRepository.getDataValue({id: req.body.buyer_id})
    if(dbUser){
        const token = createTokens(dbUser,res)
        return res.status(201).json({accessToken: token})
    }
    return res.status(401).send('Cannot update user')
}