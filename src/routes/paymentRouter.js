import {buyCollection} from "../middleware/payment.js";

export const paymentRoute = {
    '/payment/:collectionId/buy':{
        method: 'POST',
        middleware:[],
        handler:buyCollection
    }
}