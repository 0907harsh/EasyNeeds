var rp = require('request-promise');
var fs= require('fs')

const spoonacular = (query,number, callback)=>{
    // console.log(query,number)
    const url='https://api.spoonacular.com/recipes/search?query='+query+'&number='+number+'&apiKey='+process.env.SPOONACULAR_API_KEY
    rp({url,json:true},(error, {body}={})=>{
        if(error){
            callback(error,{})
        }else{
            // console.log(url)
            if(body.error){
                callback(body.error,{})
            }
            else{
                callback(undefined,{
                    recipes:body.results,
                })
             }
         }
    })
}

module.exports=spoonacular
