const path=require('path')
const dotenv=require('dotenv')
const result=dotenv.config({path:'./config/.env'})
const http=require('http')
const express=require('express')
const hbs=require('hbs')
require('./db/mongoose')
const USER=require('./models/user')
const rp=require('request-promise')
const geocode=require('./utils/geocode.js')
const forecast=require('./utils/openweather.js')
const socketio=require('socket.io')
const auth=require('./middleware/auth')

const app=express()
const server=http.createServer(app)
const io=socketio(server)
const port = process.env.PORT|| 3000
var cookieParser = require('cookie-parser');

//Defne path for Express config
const viewsPath=path.join(__dirname,'../templates/views')
const partialsPath=path.join(__dirname,'../templates/partials')


//Setup handlebars engine and viesws locaitons
app.set('view engine','hbs')
app.set('views',viewsPath)

//Partials path setup
hbs.registerPartials(partialsPath)
var TOKEN

//Setup static directory to serve
app.use(express.static(path.join(__dirname,'../public')))
app.use(require("body-parser").json())

app.use(cookieParser());

//root or homepage setup
app.get('',(req,res)=>{
    if(!req.cookies.userData){
        res.cookie('userData',{isLoggedIn:false})
    }
    io.on('connection',(socket)=>{
        try{
            socket.emit('isLoggedIn',req.cookies.userData.isLoggedIn)
        }catch{
            socket.emit('isLoggedIn',false)
        }
    })
    res.render('index',{
        title:'Homepage',
        name:'Harsh Gupta',
        activeHome:'uk-active', 
    })
})

// root/about page setup
app.get('/about',auth,(req,res)=>{
    res.render('about',{
        title:req.user.username,
        name:'Harsh Gupta',
        activeAbout:'uk-active',
        isLoggedIn:true
    })
})

// root/help page setup
app.get('/help',auth,(req,res)=>{
    res.render('help',{
        message:'This is help message.....',
        title:req.user.username,
        name:'Harsh Gupta',
        activeHelp:'uk-active',
        isLoggedIn:true
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

app.get('/help/*',auth,(req,res)=>{
    res.render('error404',{
        title:'error 404',
        message:'Help article not found',
        name:'Harsh Gupta'
    })
})

app.get('/signup',(req,res)=>{
    res.render('signup',{
        title:'hi',
        message:'Please Login',
        name:'Harsh Gupta'
    })
})

app.post('/signup',async (req,res)=>{
    const user=new USER(req.body)
    try{
        await user.save()
        // sendWelcomeEmail(user.email,user.name)
        const token=await user.generateAuthToken()
        res.clearCookie('userData')
        res.cookie("userData", {user,token,isLoggedIn:true}); 
        res.status(201).send({user,token})
    }catch(e){
        res.cookie("userData", {isLoggedIn:false}); 
        res.status(400).send('error')
    }
})

app.get('/profile',(req,res)=>{
     res.render('profile',{
         title:'profile',
         message:'You wanted to see your profile here',
         name:'Harsh Gupta'
     })
 })

app.get('/login',(req,res)=>{
//    console.log('Hi there')
    res.render('login',{
        title:'login',
        message:'Please Login',
        name:'Harsh Gupta'
    })
})


app.post('/login',async(req,res)=>{
    try{
        const user= await USER.findByCredentials(req.body.username,req.body.password)
        const token=await user.generateAuthToken()
        res.clearCookie('userData')
        res.cookie("userData", {user,token,isLoggedIn:true});
        res.status(202).send({user,token})
    }catch(e){
        res.cookie("userData", {isLoggedIn:false}); 
        res.status(500).send({error:'Unable to Login'})
    }
})

app.post('/logout',auth,async(req,res)=>{
    try{
        req.user.tokens=req.user.tokens.filter((token)=>{
            return token.token !==req.token
        })
        await req.user.save()
        res.clearCookie('userData')
        res.cookie("userData", {isLoggedIn:false});
        res.status(202).send({success:'Logged Out Successfully'})
    }catch(e){
        res.status(500).send('errrrrrrrr')
    }
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
