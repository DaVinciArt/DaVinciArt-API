import {
    createCollection,
    deleteCollection,
    editCollection,
    getWithPainting,
    getAllById
} from "../middleware/collection.js";
import {uploadAny} from '../middleware/fileUpload.js'

export const userCollectionRoute = {
    '/user/:userId/collection/:collectionId/get':{
        method:'GET',
        middleware:[],
        handler: getWithPainting
    },
    '/user/:userId/collection/getAll':{
        method:'GET',
        middleware:[],
        handler: getAllById
    },
    '/user/:userId/collection/add':{
        method:'POST',
        middleware:[uploadAny],
        handler: createCollection
    },
    '/user/:userId/collection/:collectionId/edit':{
        method:'PUT',
        middleware:[uploadAny],
        handler: editCollection
    },
    '/user/:userId/collection/:collectionId':{
        method:'DELETE',
        middleware:[],
        handler: deleteCollection
    }
}