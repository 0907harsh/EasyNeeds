var rp = require('request-promise');
var fs= require('fs')

const geocode = (address, callback)=>{
    const url='https://api.mapbox.com/geocoding/v5/mapbox.places/'+address+'.json?access_token=pk.eyJ1IjoiaGFyc2gwOTA3IiwiYSI6ImNrYTFmNDQzbzByNWkzbnFydHJhZXFpcTgifQ.3q68LKh7RU2Oku6JPDNR0A&limit=1'
    rp({url,json:true},(error, response)=>{
        if(error){
            callback(error,{})
        }else{
            if(response.body.features.length===0){
                callback(response.body.error,{})
            }
            else{
                callback(undefined,{
                    latitude:response.body.features[0].center[1],
                    longitude:response.body.features[0].center[0],
                    place:response.body.features[0].place_name
                })
                const data=response.body
                const dataJSON=JSON.stringify(data)
                fs.writeFileSync('geocoding.json',dataJSON)
             }
         }
    })
}

module.exports=geocode