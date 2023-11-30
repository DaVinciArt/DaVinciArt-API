import {CollectionRepository} from "../Repositories/CollectionRepository.js";
import cloudinary from '../index.js'
import * as fs from "fs";
import {collectionRouter} from "../routes/collectionRouter.js";

export async function createCollection(req,res){
    const userId = req.params.userId;
    const body = {...req.body}
    console.log(body)
    const collectionBody = await createCollectionBody(req, userId)
    console.log(collectionBody)
    if(!collectionBody) res.status(400).send({message: 'Not enough data to create collection'})
    const collection = await CollectionRepository.create(collectionBody)
    if(!collection) return res.status(400).send({message:'Cannot create this collection'})
    return res.statusCode(201)


}
async function createCollectionBody(req, userId){
    const tags = req.body.tags.split(' ')
    const collection = {
        ...req.body,
        tags: tags,
        author_id: userId,
        price: +req.body.price,
        pictures: [],
        status: 'on hold',
        preview_image_url: ' '
    }
    console.log(req.files.length)
    console.log(!!req.files)
    if (req.files) {
        for (const file of req.files) {
            if(file.fieldname === 'preview'){
                while (collection.preview_image_url === ' '){
                    collection.preview_image_url = await uploadPicture(file.path)
                }
            }else{
            console.log(`Path: ${file.path} \n Filename: ${file.fieldname} \n Original name: ${file.originalname}`)
            const match = /pictures\[(\d+)\]\[image\]/.exec(file.fieldname);
            if (match) {
                const imageUrl = await uploadPicture(file.path)
                const index = match[1];
                collection.pictures[index] = {
                    picture_name: req.body.pictures[`[${index}][picture_name]`],
                    image: imageUrl
                };
            }
            }
        }
    }
    return giveNameToImages(req.body.pictures, collection)
}

function giveNameToImages(pictures, resultArr){
    for (let i=0;i<pictures.length;i++){
        resultArr.pictures[i].picture_name=pictures[i].picture_name
    }
    return resultArr
}
async function uploadPicture(path){
    const result = await cloudinary.uploader.upload(path, {folder:"collection/displayImages/"});
    fs.unlink(path, (err) => {
        if (err) console.error("Error deleting temp file", err);
    });
    return  result.secure_url;
}