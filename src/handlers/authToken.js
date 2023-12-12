import jwt from "jsonwebtoken";

let pass = false
export function authToken(req,res,next){
    const authHeader = req.headers['authorization'];
    console.log(!authHeader)
        if(req.method === 'GET') {
            if (!authHeader)
                pass=true
        }
    if(pass)
        return next();
    const token = authHeader && authHeader.split(' ')[1];
    if(token == null) return res.sendStatus(401);

    jwt.verify(token, process.env.SECRET, (err, user) => {
        if(err) return res.sendStatus(403);
        req.user = user;
        next();
    })

}

