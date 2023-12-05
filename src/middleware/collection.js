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
    const userId = req.routeParams.userId;
    console.log(userId)
    const body = await editCollectionBody(req)
    console.log({...body})
    const collection = await CollectionRepository.update(collectionId, body)
    if(collection) return res.status(200).json({collection: collection[1][0]})
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
    const page= req.query.page
    const limit = req.query.limit
    const collections = await CollectionRepository.getByPopularity(page,limit)
    if (!collections) return res.status(404).send({message: "Cannot get collections"})
    console.log(collections)
    return res.status(200).json({collections: collections})
}
export async function getTopFiveCollections(req,res){
    const collections = await CollectionRepository.getByPopularity()
    if (!collections) return res.status(404).send({message: "Cannot get collections"})
    return res.status(200).json(collections)
}
export async function getAllById(req, res){
    const body = await CollectionRepository.getCollectionByUserId(req.routeParams.userId)
    if(!body) return res.sendStatus(404)
    return res.status(200).json(body)
}

export async function getWithPainting(req,res){
    const userId = req.routeParams.userId
    const collectionId = req.params.collectionId
    const body = await CollectionRepository.searchDV({id: collectionId,author_id:userId}, [Painting])
    if(!body) return res.sendStatus(404)
    console.log(`Body: ${body}`)
    return res.status(200).json(body)
}
async function createCollectionBody(req) {
    const userId = req.routeParams.userId;
    const {username} = await UserRepository.getDataValue({id: userId})
    const tags = req.body.tags.split(' ')
    let collection = {
        ...req.body,
        tags: tags,
        author_id: userId,
        author_name: username,
        price: +req.body.price,
        paintings: req.paintings? req.paintings: [],
        on_sale: false,
        preview_image_url: req.body.preview_image_url ? req.body.preview_image_url: ' ',
        views: req.body.views
    }
    if (req.files) {
        console.log(req.files.length)
        await saveToCloud(req,collection)
        console.log(req.body.paintings)
        const fullFromedCollection = giveNameToImages(req.body.paintings, collection)
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
        const fullFromedCollection = giveNameToImages(req.body.paintings, collection)
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

    function giveNameToImages(paintings, resultArr) {
        for (let i = 0; i < paintings.length; i++) {
            resultArr.paintings[i].name = paintings[i].name
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
                const match = /paintings\[(\d+)]\[image]/.exec(file.fieldname);
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
                        name: req.body.paintings[result.index].name,
                        image_url: result.imageUrl
                    };
                }
            }
        } catch (err) {
            console.error("Error in file upload:", err);
        }
        return collection
}
