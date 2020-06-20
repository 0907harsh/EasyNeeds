const path=require('path')
const dotenv=require('dotenv')
const result=dotenv.config({path:'./config/.env'})
const http=require('http')
const express=require('express')
const hbs=require('hbs')
require('./db/mongoose')
const multer=require('multer')
const sharp=require('sharp')
const USER=require('./models/user')
const LocationSearched=require('./models/searchedLocation')
const rp=require('request-promise')
const geocode=require('./utils/geocode.js')
const forecast=require('./utils/openweather.js')
const spoonacular=require('./utils/spoonacular.js')
const socketio=require('socket.io')
const {sendWelcomeEmail,DeleteAccounEmail}=require('./sendgrid/account')
const auth=require('./middleware/auth')
const localforage=require('localforage')

const app=express()
const server=http.createServer(app)
const io=socketio(server)
const port = process.env.PORT|| 3000
var cookieParser = require('cookie-parser');
const adminauth = require('./middleware/adminauth')

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
    // console.log(req.cookies.userData)
    if(!req.cookies.userData){
        // console.log(req.cookies.userData)
        res.cookie('userData',{isLoggedIn:false},{httpOnly:true})
    }
    io.on('connection',(socket)=>{
        socket.on('getoptions',async(searchCriteria,fn)=>{
            let re = new RegExp("["+searchCriteria+"]", "gi");
            // console.log(re)
            try{
                const LocationOptions= await LocationSearched.find({location: re})
                fn(LocationOptions)
            }catch{
                fn('')
            }  
       })
       socket.on('getCookie',()=>{
           console.log(req.cookies)
       })
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

app.post('/serveCookie',(req,res)=>{
    res.status(202).send(req.cookies)
})

app.post('/loginstatus',(req,res)=>{
    res.status(202).send(req.cookies.userData.isLoggedIn)
})

app.get('/recipe',auth,(req,res)=>{
    res.render('recipe',{
        message:'Get worldclass recipes here...',
        title:req.user.username,
        name:'Harsh Gupta',
        activeRecipe:'uk-active',
        isLoggedIn:true
    })
})

app.get('/weather',async (req,res)=>{
    if(!req.query.address){
        return res.send({
            error:'No address provided'
        })
    }
    const query=await LocationSearched.findOne({location:req.query.address})
    if(!query){
    const newSearch=new LocationSearched({location:req.query.address,timesSearched:1})
    await newSearch.save()
    }else{
        query.timesSearched+=1
        await query.save()
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

app.post('/recipe',(req,res)=>{
    if(!req.body){
        return res.send({
            error:'No address provided'
        })
    }
    // console.log(req.body.queries,req.body.numberq)
    spoonacular(req.body.queries,req.body.numberq , (error,recipes) => {
        if(error){
            console.log('ERROR')
            return res.send({error:error.message})
         }
        //  console.log(recipes.recipes)
         res.send({  
            recipes:recipes.recipes
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
        sendWelcomeEmail(user.email,user.username)
        res.clearCookie('userData',{httpOnly:true})
        res.cookie("userData", {user,token,isLoggedIn:true},{maxAge: 900000000,httpOnly:true}); 
        res.status(201).send({user,token})
    }catch(e){
        res.cookie("userData", {isLoggedIn:false},{httpOnly:true}); 
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
        
        const user= await USER.findByCredentials(req.body.email,req.body.password)
       
        const token=await user.generateAuthToken()
        res.clearCookie('userData',{httpOnly:true})
        // console.log(req.cookies)
        res.cookie("userData", {user,token,isLoggedIn:true},{maxAge: 900000000,httpOnly:true});
        
        res.status(202).send({user,token})
        
    }catch(e){
        res.cookie("userData", {isLoggedIn:false},{httpOnly:true}); 
        res.status(500).send({error:'Unable to Login'})
    }
})


var uploads=multer({
    limits:{
        fileSize:1000000
    },
    fileFilter(req,file,cb){
        // You can always pass an error if something goes wrong:
        if(!file.originalname.match(/\.(jpg|jpeg|png)$/gi)){
            cb(new Error('Please upload images'))
        }
        // To accept the file pass `true`, like so:
        cb(undefined, true)
    }
})

app.get('/avatars',auth,(req,res)=>{
    res.render('playtar',{
        title:"Avatar",
        message:'Avatar Upload',
        name:'Harsh Gupta'
    })
})

app.post('/me/getavatars',auth,async (req,res)=>{
    try{
        // console.log(req.user.avatar)
        res.status(202).send({data:req.user.avatar})
    }catch{
        // console.log('Error')
        res.status(404).send('')
    }
})

app.post('/me/avatars',auth,uploads.single('avatar'),async (req,res)=>{
    // req.user.avatar=req.file.buffer
    const buffer=await sharp(req.file.buffer).resize({width:250,height:250}).png().toBuffer()
    req.user.avatar=buffer
    await req.user.save()
    // console.log( buffer)
    // console.log(req.user._id)
    res.status(202).send({data : buffer})
},(error,req,res,next)=>{
    console.log("ERROR")
    res.status(400).send({error:error.message})
    
})


app.delete('/me/avatars',auth,async (req,res)=>{
    req.user.avatar=undefined
    await req.user.save()
    res.send()
},(error,req,res,next)=>{
    res.status(400).send({error:error.message})
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



app.get('/Accessdenied',(req,res)=>{
    res.render('accessDenied',{
        title:403,
        message:'Access Denied',
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
