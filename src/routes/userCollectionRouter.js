import {Router} from "express";
import {
    createCollection,
    deleteCollection,
    editCollection,
    getWithPainting
} from "../middleware/collection.js";
import {uploadAny} from '../middleware/fileUpload.js'
import {getAllById} from '../middleware/collection.js'
export const userCollectionRouter = Router();


userCollectionRouter.get('/:collectionId/get', getWithPainting)
userCollectionRouter.get('/getAll',getAllById)
userCollectionRouter.post('/add',uploadAny,createCollection);
userCollectionRouter.post('/:collectionId/edit', uploadAny, editCollection)
userCollectionRouter.delete('/:collectionId',deleteCollection)