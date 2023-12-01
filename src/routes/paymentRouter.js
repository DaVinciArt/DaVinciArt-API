import {Router} from "express";
import {buyCollection} from "../middleware/payment.js";
export const paymentRouter = Router();


paymentRouter.post('/:collectionId/buy',buyCollection)