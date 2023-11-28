
export function getPaintings(req,res){
    res.status(201).send()
}
export function createPainting(req,res){
    const {name} = req.body;
    paintings.push(name);
    res.status(201).send(name);
}
const paintings = ["DICK","COCK","PENIS","BALLS"];

export function getPicture(req,res){
    const {imageBlob} = req.body;

}
