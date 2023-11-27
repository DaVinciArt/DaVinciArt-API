import {Router} from "express";
import "../middleware/paintings.js";
import {createPainting, getPaintings} from "../middleware/paintings.js";

export const paintingsRouter = Router();

paintingsRouter.get('/getPainting',getPaintings);
paintingsRouter.post('/addPainting',createPainting);