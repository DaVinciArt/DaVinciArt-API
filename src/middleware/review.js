import {ReviewRepository} from "../Repositories/ReviewRepository.js";
import {filterUserForToken} from "./auth.js";

export async function addComment(req, res) {
    const dbResponse = await ReviewRepository.create(+req.params.userId,req.body)
    if(dbResponse) return res.status(201).send({message: 'Added commentary'})
    return res.status(404).send({message:'Cannot create review'})
}



export async function deleteComment(req,res){
    const result = await ReviewRepository.delete({id: req.params.reviewId})
    if(!result) return res.status(404).send({message:'Cannot delete comment'})
    return res.status(200).send({message:'Comment deleted successfully'})
}
export async function getAllComments(req,res){
    const reviews = await ReviewRepository.getAll(+req.params.userId)
    if(!reviews) return res.status(404).send('Cannot find reviews for this users')
    return res.status(201).json(convertToResponse(reviews))
}

export async function editComment(req,res){
    const result = await ReviewRepository.updateText(req.params.reviewId, req.body)
    if(!result) return res.status(404).send({message:'Cannot edit comment'})
    return res.status(200).send({message:'Comment edited successfully'})
}

function convertToResponse(array){
    const result = []
        array.forEach((comment) =>{
            const {id, commentator_id, receiver_id, upload_date, comment_text, commentator} =  comment.dataValues
            const user = filterUserForToken(commentator.dataValues)
        result.push({id, commentator_id,receiver_id,upload_date,comment_text,commentator:user})
    })
    return {result}
}