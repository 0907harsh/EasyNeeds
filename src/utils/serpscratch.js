var rp = require('request-promise');
var fs= require('fs')
var url
const serpscratch = (query,images, callback)=>{
    if(images===true)
        url='http://api.serpstack.com/search?access_key='+process.env.SEARCH_ID+'&query='+query+'&safe=1&auto_location=1'
    else
        url='http://api.serpstack.com/search?access_key='+process.env.SEARCH_ID+'&query='+query+'&images_page=12&safe=1&auto_location=1'
    rp({url,json:true},(error, response)=>{
        if(error){
            console.log('From : Serp ScrathUnable to access Search Engine . PLease Check Your Connection and try again')
            callback('Unable to access Search Engine . PLease Check Your Connection and try again',{})
        }else{
            if(response.body.success===false){
                callback(response.body.error,{})
            }
            else{
                callback(undefined,{
                    organic_results:response.body.organic_results,
                    local_results:response.body.local_results,
                    total_time:response.body.request.total_time_taken,
                    ads:response.body.ads,
                    related_searches:response.body.related_questions
                })
             }
         }
    })
}

module.exports=serpscratch