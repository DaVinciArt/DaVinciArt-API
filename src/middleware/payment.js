import {CollectionRepository} from "../Repositories/CollectionRepository.js";
import {UserRepository} from "../Repositories/UserRepository.js";

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
    return res.status(200).send({message:'Payed successfully'})
}