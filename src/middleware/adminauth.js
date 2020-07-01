const adminauth = async(req,res,next)=>{
    try{
        // console.log(req.headers.referer)
        // console.log(req.headers.host)
        if(req.headers.referer===('http://'+req.headers.host+'/') || req.headers.referer===('https://'+req.headers.host+'/'))
        next()
        else
        res.writeHead(302, { "Location": "https://" + req.headers['host'] + "/Accessdenied"}).end();
    }catch(e){
        res.status(403).send({error: 'Access Forbidden'})
    }
}

module.exports= adminauth