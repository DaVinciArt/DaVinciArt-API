import {getPopularCollections, getTopFiveCollections} from "../middleware/collection.js";

export const collectionRoute = {
    '/collection/getTopFive':{
        method:'GET',
        middleware: [],
        handler: getTopFiveCollections
    },
    '/collection/getPopular':{
        method:'GET',
        middleware: [],
        handler: getPopularCollections
    }
}