const path=require('path')
const http=require('http')
const express=require('express')
const hbs=require('hbs')
require('./db/mongoose')
const USER=require('./models/user')
const rp=require('request-promise')
const geocode=require('./utils/geocode.js')
const forecast=require('./utils/openweather.js')
const socketio=require('socket.io')

const app=express()
const server=http.createServer(app)
const io=socketio(server)
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
io.on('connection',(socket)=>{
    console.log('New Connection Detected')
})

//root or homepage setup
app.get('',(req,res)=>{
    res.render('index',{
        title:'weather',
        name:'Harsh Gupta',
        activeHome:'uk-active'
    })
})

// root/about page setup
app.get('/about',(req,res)=>{
    res.render('about',{
        title:'about',
        name:'Harsh Gupta',
        activeAbout:'uk-active'
    })
})

// root/help page setup
app.get('/help',(req,res)=>{
    res.render('help',{
        message:'This is help message.....',
        title:'help',
        name:'Harsh Gupta',
        activeHelp:'uk-active'
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

app.get('/login',(req,res)=>{
    res.render('login',{
        title:'login',
        message:'Please Login',
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
server.listen(port,()=>{
    console.log('Server is up on port '+port)
})
