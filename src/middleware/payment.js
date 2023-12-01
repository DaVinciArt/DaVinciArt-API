import {collectionRouter} from "../routes/collectionRouter.js";
import {CollectionRepository} from "../Repositories/CollectionRepository.js";
import {UserRepository} from "../Repositories/UserRepository.js";

export async function buyCollection(req,res){
    const buyer = UserRepository.getUserById(req.body.buyer_id)
    const seller = UserRepository.getUserById(req.body.seller_id)
    const collectionId = req.payload.colectionId;
    const collection = await CollectionRepository.getCollectionWithPainting(collectionId)
    if(buyer.balance < collection.price) return res.status(400).send({message:'Not enough money'})
    collection.author_id = req.body.buyer_id
    buyer.balance-=collection.price
    seller.balance+=collection.price
    buyer.update()
    seller.update()
    collection.update()





}