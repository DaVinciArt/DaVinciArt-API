import {Router} from "express";
import {getPopularCollections, getTopFiveCollections} from "../middleware/collection.js";
export const collectionRouter = Router();

collectionRouter.get('/getTopFive',getTopFiveCollections)
collectionRouter.get('/getPopular', getPopularCollections)