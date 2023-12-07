import jwt from "jsonwebtoken";

const exceptionRoutes = [/\d+$/]
const exceptionMethods = 'GET'
let pass = false
export function authToken(req,res,next){
    exceptionRoutes.forEach((regEx) => {
        if(regEx.test(`${req.method}:${req.url}`) || req.method === exceptionMethods) {
            if (!req.headers['authorization'])
                pass=true
        }})
    if(pass)
        return next();
    console.log('cock')
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];
    if(token == null) return res.sendStatus(401);

    jwt.verify(token, process.env.SECRET, (err, user) => {
        if(err) return res.sendStatus(403);
        req.user = user;
        next();
    })

}

