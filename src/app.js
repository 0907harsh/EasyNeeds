const path=require('path')
const express=require('express')
const hbs=require('hbs')
const rp=require('request-promise')
const geocode=require('./utils/geocode.js')
const forecast=require('./utils/openweather.js')

const app = express()
const port = process.env.PORT|| 3000
//Defne path for Express config
const viewsPath=path.join(__dirname,'../templates/views')
const partialsPath=path.join(__dirname,'../templates/partials')

//Setup handlebars engine and viesws locaitons
app.set('view engine','hbs')
app.set('views',viewsPath)

//Partials path setup
hbs.registerPartials(partialsPath)


//Setup static directory to serve
app.use(express.static(path.join(__dirname,'../public')))

//root or homepage setup
app.get('',(req,res)=>{
    res.render('index',{
        title:'weather',
        name:'Harsh Gupta'
    })
})

// root/about page setup
app.get('/about',(req,res)=>{
    res.render('about',{
        title:'about',
        name:'Harsh Gupta'
    })
})

// root/help page setup
app.get('/help',(req,res)=>{
    res.render('help',{
        message:'This is help message.....',
        title:'help',
        name:'Harsh Gupta'
    })
})
app.get('/weather',(req,res)=>{
    if(!req.query.address){
        return res.send({
            error:'No address provided'
        })
    }
    geocode(req.query.address,(error,{latitude,longitude,place:location}={})=>{
        if(error){
             return res.send({error})
        }
        forecast(latitude,longitude , (error, Forecastdata) => {
           if(error){
             return res.send({error:error.message})
            }
            res.send({
                forecast:Forecastdata.current.weather[0].description,
                current_temp:(Forecastdata.current.temp-273.15).toFixed(2),
                is_day:1,
                feelslike_c:(Forecastdata.current.feels_like-273.15).toFixed(2),
                location,
                icon:'http://openweathermap.org/img/wn/'+Forecastdata.current.weather[0].icon+'@2x.png',
                timestamp:Forecastdata.current.dt,
                current_text:Forecastdata.current.weather[0].main,
                address:req.query.address
            })
        })
     })
})

app.get('/products',(req,res)=>{
    if(!req.query.search){
        return res.send({
            error:'You mest provide a search term'
        })
    }
    res.send({
        products:[]
    })
})//Error [ERR_HTTP_HEADERS_SENT]: Cannot set headers after they are sent to the client

app.get('/help/*',(req,res)=>{
    res.render('error404',{
        title:'error 404',
        message:'Help article not found',
        name:'Harsh Gupta'
    })
})

app.get('*',(req,res)=>{
    res.render('error404',{
        title:404,
        message:'Page not found',
        name:'Harsh Gupta'
    })
})
app.listen(port,()=>{
    console.log('Server is up on port '+port)
})
