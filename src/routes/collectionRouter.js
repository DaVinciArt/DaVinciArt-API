import {Router} from "express";
import {createCollection} from "../middleware/collection.js";
import {uploadAny} from '../middleware/fileUpload.js'
export const collectionRouter = Router();
