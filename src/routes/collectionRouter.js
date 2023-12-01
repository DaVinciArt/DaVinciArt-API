import {Router} from "express";
import {createCollection} from "../middleware/collection.js";
import {uploadAny} from '../middleware/fileUpload.js'
import {getById} from '../middleware/collection.js'
export const collectionRouter = Router();


collectionRouter.get('/:userId/getAll',getById)
collectionRouter.get('')
collectionRouter.post('/:userId/add',uploadAny,createCollection);