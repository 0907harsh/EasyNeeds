const fetchJson = require('./fetch-json')
var fs= require('fs')

const forecast = (latitude,longitude, callback)=>{
    const url='http://api.weatherapi.com/v1/forecast.json?key='+process.env.SEARCH_WEATHER_ID+'&q='+latitude+','+longitude+'&days=1'
    fetchJson(url,(error, {body})=>{
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
