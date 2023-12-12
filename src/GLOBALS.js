import {fileURLToPath} from "url";
import path from "path";
import dotenv from "dotenv";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.resolve(__dirname, 'config/.env') })
console.log(path.resolve(__dirname, 'config/.env') )

export const JWTSECRET = process.env.SECRET
export const CLOUDINARY_NAME = process.env.CLOUDINARY_NAME
export const CLOUDINARY_API =  process.env.CLOUDINARY_API
export const CLOUDINARY_SECRET = process.env.CLOUDINARY_SECRET
export const REFRESH_SECRET = process.env.REFRESH_SECRET
export const SESSION_SECRET=process.env.SESSION_SECRET
export const PORT=process.env.PORT
export const POSTGRE_PASS=process.env.POSTGRE_PASS
export const POSTGRE_USERNAME=process.env.POSTGRE_USERNAME
export const POSTGRE_HOST=process.env.POSTGRE_HOST

