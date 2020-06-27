const jwt=require('jsonwebtoken')
const USER=require('../models/user')

//the actual auth middleware
const auth = async(req,res,next)=>{
    try{    
        // console.log(req)
        const token=req.cookies.userData.token  //fetching the token used by the user
        const ismatch=jwt.verify(token,process.env.JWT_TOKEN)  //verifying the token
        const user=await USER.findOne({_id:ismatch._id,'tokens.token':token})   //fetching the user based on the given token
        if(!user){
            throw new Error('New error')
        }//isf no user is found wth the provided token Error is returned
        req.token=token
        req.user=user
        //The above statements add the user and token details to the req so that another of user is not required
        // console.log(req)
        next()
    }catch(e){
        //if any error occurs the user is forwarded to another web-page  .Which urges him to join the database first
        res.writeHead(302, { "Location": "https://" + req.headers['host'] + "/Accessdenied"}).end();
        // res.status(401).send({error: 'Please authenticate'})
    }
    
}

module.exports= auth