var rp = require('request-promise');
var fs= require('fs')

const forecast = (latitude,longitude, callback)=>{
    const url='https://api.openweathermap.org/data/2.5/onecall?lat='+latitude+'&lon='+longitude+'&%20exclude=hourly,daily&appid=4643ad7e880b46305e541877870551dd'
    rp({url,json:true},(error, {body}={})=>{
        if(error){
            callback('Unable to connect . Please check your network connection and try again',{})
        }else{
            if(body.cod==='404'){
                callback('Unable to get weather for given area.Try another search',{})
            }
            else{
                callback(undefined,{
                    current:body.current,
                    location:body.timezone,
                    hourly:body.hourly,
                    forecast:body.daily
                })
             }
         }
    })
}

module.exports = forecast