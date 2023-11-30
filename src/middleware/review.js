import {ReviewRepository} from "../Repositories/ReviewRepository.js";
import {filterUserForToken} from "./auth.js";

export async function addComment(req, res) {
    console.log(req.params.userId)
    const review = await ReviewRepository.create(+req.params.userId,req.body)
    console.log(review)
    return res.status(201).send({message: 'Added commentary'})
}


export async function getAllComments(req,res){
    const reviews = await ReviewRepository.getAllReviews(+req.params.userId)
    if(!reviews) return res.status(400).send('Cannot find reviews for this users')
    console.log(convertToResponse(reviews)[0])
    return res.status(201).json(convertToResponse(reviews))
}

function convertToResponse(array){
    const result = []
        array.forEach((comment) =>{
            const {commentator_id, receiver_id, upload_date, comment_text, commentator} =  comment.dataValues
            const user = filterUserForToken(commentator.dataValues)
        result.push({commentator_id,receiver_id,upload_date,comment_text,commentator:user})
    })
    return {...result}
}