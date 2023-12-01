import {Router} from "express";
import {createCollection, editCollection, getWithPainting} from "../middleware/collection.js";
import {uploadAny} from '../middleware/fileUpload.js'
import {getAllById} from '../middleware/collection.js'
export const collectionRouter = Router();


collectionRouter.get('/:userId/getAll',getAllById)
collectionRouter.get('/:collectionId/get',getWithPainting)
collectionRouter.post('/:userId/add',uploadAny,createCollection);
collectionRouter.post('/:collectionId/edit', uploadAny, editCollection)
collectionRouter.get('/getTopFive',)