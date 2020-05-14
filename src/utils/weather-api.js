var rp = require('request-promise');
var fs= require('fs')

const forecast = (latitude,longitude, callback)=>{
    const url='http://api.weatherapi.com/v1/forecast.json?key=d120fcf955074a7182e174856201005&q='+latitude+','+longitude+'&days=1'
    rp({url,json:true},(error, {body})=>{
        if(error){
            callback(error,{})
        }else{
            if(body.error){
                callback(body.error,{})
            }
            else{
                callback(undefined,{
                    current:body.current,
                    location:body.location,
                    forecast:body.forecast
                })
               
             }
         }
    })
}

module.exports=forecast
