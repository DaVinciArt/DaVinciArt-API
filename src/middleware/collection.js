import {CollectionRepository} from "../Repositories/CollectionRepository.js";
import cloudinary from '../index.js'
import * as fs from "fs";

export async function createCollection(req,res){
    const userId = req.params.userId;
    const body = {...req.body}
    console.log(`RequestBody: ${JSON.stringify(body)}`)
    const collectionBody = await createCollectionBody(req, userId)
    console.log(collectionBody)
    if(!collectionBody) res.status(400).send({message: 'Not enough data to create collection'})
    const collection = await CollectionRepository.create(collectionBody)
    if(!collection) return res.status(400).send({message:'Cannot create this collection'})
    return res.status(201)

}

export async function getById(req,res){
    const body = await CollectionRepository.getCollectionByUserId(req.params.userId)
    console.log(`Body: ${body}`)
    return res.status(200).json(body)
}
async function createCollectionBody(req, userId){
    const tags = req.body.tags.split(' ')
    const collection = {
        ...req.body,
        tags: tags,
        author_id: userId,
        price: +req.body.price,
        paintings: [],
        status: 'on hold',
        preview_image_url: ' '
    }
    console.log(req.files.length)
    if (req.files) {
        let uploadPromises = [];
        for (const file of req.files) {
            if(file.fieldname === 'preview'){
                let uploadPromise = uploadPicture(file.path).then(imageUrl => {
                    return { type: 'preview', imageUrl };
                });
                uploadPromises.push(uploadPromise);
            }else{
                const match = /paintings\[(\d+)\]\[image\]/.exec(file.fieldname);
                if (match) {
                    let uploadPromise = uploadPicture(file.path).then(imageUrl => {
                        const index = match[1];
                        return { type: 'painting', index, imageUrl };
                    });
                    uploadPromises.push(uploadPromise);
            }
        }
    } try {
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
    }
    console.log(req.body.paintings)
    const fullFromedCollection = giveNameToImages(req.body.paintings, collection)
    console.log(JSON.stringify(fullFromedCollection.paintings[0]))
    const data = {upload_date: fullFromedCollection.upload_date}
    for(let i = 0; i<fullFromedCollection.paintings.length;i++){
        fullFromedCollection.paintings[i] = addDataToPainting(fullFromedCollection.paintings[i],data)
    }

    console.log(`FullFormed ${JSON.stringify(fullFromedCollection)}`)
    return fullFromedCollection

}

function addDataToPainting(painting, data){
    console.log(`ALL:${JSON.stringify({...painting, ...data})} \n Painting${JSON.stringify(painting)} \n DATA:${JSON.stringify(data)}`)
    return {
        ...painting,
        ...data
    }
}
function giveNameToImages(paintings, resultArr){
    for (let i=0;i<paintings.length;i++){
        resultArr.paintings[i].name=paintings[i].name
    }
    return resultArr
}
async function uploadPicture(path){
    let result  = null
    try{
        result = (await cloudinary.uploader.upload(path, {folder: "collection/displayImages/"})).secure_url;
        await fs.unlink(path, (err) => {
            if (err) console.error("Error deleting temp file", err);
        });}
        catch(err){
            console.log(err)
        }
    return result;
}