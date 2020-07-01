const loginauth = async(req,res,next)=>{
    try{
        // console.log(req.cookies.userData.isLoggedIn.toString()==="false")
        if(req.cookies.userData.isLoggedIn.toString()==="false")
        next()
        else
        res.writeHead(200, { "Location": "https://" + req.headers['host'] + "/profile"}).end();
    }catch(e){
        res.status(403).send({error: 'Access Forbidden'})
    }
}

module.exports= loginauth