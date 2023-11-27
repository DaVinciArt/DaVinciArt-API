export function getPaintings(req,res){
    res.status(201).send(paintings[Math.floor(Math.random()*3)])
}
export function createPainting(req,res){
    const {name} = req.body;
    paintings.push(name);
    res.status(201).send(name);
}
const paintings = ["DICK","COCK","PENIS","BALLS"];