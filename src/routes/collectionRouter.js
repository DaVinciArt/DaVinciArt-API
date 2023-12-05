import {Router} from "express";
import {getTopFiveCollections} from "../middleware/collection.js";
export const collectionRouter = Router();

collectionRouter.get('/getTopFive',getTopFiveCollections)