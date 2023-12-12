import {CollectionRepository} from "../Repositories/CollectionRepository.js";
import cloudinary from '../index.js'
import * as fs from "fs";
import {UserRepository} from "../Repositories/UserRepository.js";
import {Painting} from "../databaseSchemes/dataScheme.js";

export async function createCollection(req,res){
    const collectionBody = await createCollectionBody(req)
    console.log(collectionBody)
    if(!collectionBody) res.status(400).send({message: 'Not enough data to create collection'})
    const collection = await CollectionRepository.create(collectionBody)
    if(!collection) return res.status(400).send({message:'Cannot create this collection'})
    return res.sendStatus(200)
}

export async function editCollection(req,res){
    const collectionId =req.params.collectionId;
    const userId = req.params.userId;
    if (!(await UserRepository.getDataValue({id: userId}))) return res.status(404).send({message: 'Cannot find user'})
    const body = await editCollectionBody(req)
    body.price = +body.price
    body.tags = body.tags.split(' ')
    console.log({...body})
    const collection = await CollectionRepository.update(collectionId, body)
    console.log(JSON.stringify(collection))
    if(collection) return res.status(200).json({collection: collection})
    return res.sendStatus(404)
}

export async function deleteCollection(req,res){
    const collectionId = req.params.collection_id
    if(await CollectionRepository.delete(collectionId)){
        res.status(200).send({message: 'Deleted successfully'})
    }
    res.status(404).send({message:'Cannot delete this collection'})
}

export async function getPopularCollections(req,res){
    console.log({...req.query})
    const {page, limit, ...searchQuery}= req.query
    const collections = await CollectionRepository.getWithOffset(page,limit,searchQuery)
    if (!collections) return res.status(404).send({message: "Cannot get collections"})
    console.log(collections)
    return res.status(200).json({collections: collections})
}
export async function getTopFiveCollections(req,res){
    const collections = await CollectionRepository.getWithOffset()
    if (!collections) return res.status(404).send({message: "Cannot get collections"})
    return res.status(200).json(collections)
}
export async function getAllById(req, res){
    const body = await CollectionRepository.getCollectionByUserId(req.params.userId)
    if(!body) return res.sendStatus(404)
    return res.status(200).json(body)
}

export async function getWithPainting(req,res){
    const userId = req.params.userId
    const collectionId = req.params.collectionId
    const body = await CollectionRepository.searchDV({id: collectionId,author_id:userId},Painting,req.user)
    if(!body) return res.sendStatus(404)
    return res.status(200).json(body)
}
async function createCollectionBody(req) {
    console.log(req.body.image)
    console.log(req.files.length)
    const userId = req.params.userId;
    const {username} = await UserRepository.getDataValue({id: userId})
    const tags = req.body.tags.split(' ')
    let collection = {
        ...req.body,
        tags: tags,
        author_id: userId,
        author_name: username,
        price: +req.body.price,
        paintings: req.paintings? req.paintings: [],
        on_sale: !(+req.body.price),
        preview_image_url: req.body.preview_image_url ? req.body.preview_image_url: ' ',
        views: req.body.views
    }
    if (req.files) {
        console.log(req.files.length)
        console.log(req.files)
        await saveToCloud(req,collection)
        console.log(req.body.images)
        const fullFromedCollection = giveNameToImages(req.body.image,req.files.length-1, collection)
        console.log(JSON.stringify(fullFromedCollection.paintings[0]))
        const data = {upload_date: fullFromedCollection.upload_date}
        for (let i = 0; i < fullFromedCollection.paintings.length; i++) {
            fullFromedCollection.paintings[i] = addDataToPainting(fullFromedCollection.paintings[i], data)
        }
        collection = fullFromedCollection
    }
    console.log(`FullFormed ${JSON.stringify(collection)}`)
    return collection
}

async function editCollectionBody(req) {
    let collection = {
        ...req.body
    }
    if (req.files) {
        await saveToCloud(req,collection)
        const fullFromedCollection = giveNameToImages(req.body.image,req.files.length-1, collection)
        const data = {upload_date: fullFromedCollection.upload_date}
        for (let i = 0; i < fullFromedCollection.paintings.length; i++) {
            fullFromedCollection.paintings[i] = addDataToPainting(fullFromedCollection.paintings[i], data)
        }
        collection = fullFromedCollection
    }
    console.log(`FullFormed ${JSON.stringify(collection)}`)
    return collection
}

    function addDataToPainting(painting, data) {
        console.log(`ALL:${JSON.stringify({...painting, ...data})} \n Painting${JSON.stringify(painting)} \n DATA:${JSON.stringify(data)}`)
        return {
            ...painting,
            ...data
        }
    }

    function giveNameToImages(images,filesLength, resultArr) {
    console.log(images[0])
        for (let i = 0; i < filesLength; i++) {
            resultArr.paintings[i].name = images[i]
        }
        return resultArr
    }

    async function uploadPicture(path) {
        let result = null
        try {
            result = (await cloudinary.uploader.upload(path, {folder: "collection/displayImages/"})).secure_url;
            await fs.unlink(path, (err) => {
                if (err) console.error("Error deleting temp file", err);
            });
        } catch (err) {
            console.log(err)
        }
        return result;
    }

    async function saveToCloud(req,collection) {
        let uploadPromises = [];
        for (const file of req.files) {
            if (file.fieldname === 'preview') {
                let uploadPromise = uploadPicture(file.path).then(imageUrl => {
                    return {type: 'preview', imageUrl};
                });
                uploadPromises.push(uploadPromise);
            } else {
                const match = /image\[(\d+)]/.exec(file.fieldname);
                if (match) {
                    let uploadPromise = uploadPicture(file.path).then(imageUrl => {
                        const index = match[1];
                        return {type: 'painting', index, imageUrl};
                    });
                    uploadPromises.push(uploadPromise);
                }
            }
        }
        try {
            let results = await Promise.all(uploadPromises);

            for (const result of results) {
                if (result.type === 'preview') {
                    collection.preview_image_url = result.imageUrl;
                } else if (result.type === 'painting') {
                    collection.paintings[result.index] = {
                        name: req.body.image[result.index],
                        image_url: result.imageUrl
                    };
                }
            }
        } catch (err) {
            console.error("Error in file upload:", err);
        }
        return collection
}
