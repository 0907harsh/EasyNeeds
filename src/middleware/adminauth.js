const adminauth = async(req,res,next)=>{
    try{
        console.log(req.body)
        location.replace('/')
    }catch(e){
        res.status(403).send({error: 'Access Forbidden'})
    }
}

module.exports= adminauth