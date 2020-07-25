var rp = require('request-promise');
var fs= require('fs')

const geocode = (address, callback)=>{
    const url='https://api.mapbox.com/geocoding/v5/mapbox.places/'+address+'.json?access_token='+process.env.GEOCODE_ID+'&limit=1'
    rp({url,json:true},(error, response)=>{
        if(error){
            callback('Unable to access Location services . PLease Check Your Connection and try again',{})
        }else{
            if(response.body.features.length===0){
                callback('Location not found. Try anoter search',{})
            }
            else{
                callback(undefined,{
                    latitude:response.body.features[0].center[1],
                    longitude:response.body.features[0].center[0],
                    place:response.body.features[0].place_name
                })
              
             }
         }
    })
}

module.exports=geocode