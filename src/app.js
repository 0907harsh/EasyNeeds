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
const searchserp=require('./utils/serpscratch.js')
const spoonacular=require('./utils/spoonacular.js')
const socketio=require('socket.io')
const {sendWelcomeEmail,DeleteAccounEmail}=require('./sendgrid/account')
const auth=require('./middleware/auth')
const localforage=require('localforage')
const {OAuth2Client} = require('google-auth-library');
const client = new OAuth2Client(process.env.Client_ID);

const app=express()
const server=http.createServer(app)
const io=socketio(server)
const port = process.env.PORT|| 3000
var cookieParser = require('cookie-parser');
const adminauth = require('./middleware/adminauth')
const loginauth = require('./middleware/loginauth')

//Defne path for Express config
const viewsPath=path.join(__dirname,'../templates/views')
const partialsPath=path.join(__dirname,'../templates/partials')


//Setup handlebars engine and viesws locations
app.set('view engine','hbs')
app.set('views',viewsPath)

//Partials path setup
hbs.registerPartials(partialsPath)

//Setup static directory to serve
app.use(express.static(path.join(__dirname,'../public')))
app.use(require("body-parser").json())
//Tryed using compression but it increased loading time y a large amount . Still in development mode
// app.use(compression(compression({ filter: shouldCompress })))
// function shouldCompress (req, res) {
//     console.log('Passed from here')
//     if (req.headers['x-no-compression']) {
//       // don't compress responses with this request header
//       return false
//     }
   
//     // fallback to standard filter function
//     return compression.filter(req, res)
//   }
app.use(cookieParser());

//root or homepage setup
app.get('',(req,res)=>{
    // console.log(req.headers)
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

//text-2-speech converter that is coming soon
app.get('/tos',(req,res)=>{
    res.render('texttospeech',{
        message:'This is help message.....',
        title:'Hi',
        name:'Harsh Gupta',
        activeHelp:'uk-active',
        isLoggedIn:true
    })
})

//recipe-engine setup
app.get('/recipe',auth,(req,res)=>{
    res.render('recipe',{
        message:'Get worldclass recipes here...',
        title:'aaa',
        name:'Harsh Gupta',
        activeRecipe:'uk-active',
        isLoggedIn:true
    })
})

//learning-angular setup
app.get('/angular',(req,res)=>{
    res.render('angular',{
        message:'Learning angular here...',
        title:'Angular',
        name:'Harsh Gupta',
        isLoggedIn:true,
        phones:[
            {
              name: 'Nexus S',
              snippet: 'Fast just got faster with Nexus S.'
            }, {
              name: 'Motorola XOOM™ with Wi-Fi',
              snippet: 'The Next, Next Generation tablet.'
            }, {
              name: 'MOTOROLA XOOM™',
              snippet: 'The Next, Next Generation tablet.'
            }
          ]
    })
})

//covid-update setup
app.get('/covidData',(req,res)=>{
    res.render('covidAPI',{
        message:'Get Covid Updates Here',
        title:'Covid Data',
        name:'Harsh Gupta',
        activeCovid:'uk-active',
        isLoggedIn:true
    })
})

app.get('/search',(req,res)=>{
    res.render('search',{
        message:'Get worldclass recipes here...',
        title:'aaa',
        name:'Harsh Gupta',
        activeSearch:'uk-active',
        isLoggedIn:true
    })
})

//products-page setup
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

//Signup page setup
app.get('/signup',loginauth,(req,res)=>{
    // console.log(req.headers)
    res.render('signup',{
        title:'SignUp',
        message:'Please Login',
        name:'Harsh Gupta'
    })
})

//Profile-page setup
app.get('/profile',(req,res)=>{
    // console.log(req.headers)
    res.render('profile',{
        title:'profile',
        message:'You wanted to see your profile here',
        name:'Harsh Gupta'
    })
})

//Login Page setup
app.get('/login',loginauth,(req,res)=>{
//    console.log(req.headers)
   res.render('login',{
       title:'login',
       message:'Please Login',
       name:'Harsh Gupta'
   })
})

//Profile-pic uploader Page setup
app.get('/avatars',auth,(req,res)=>{
    res.render('playtar',{
        title:"Avatar",
        message:'Avatar Upload',
        name:'Harsh Gupta'
    })
})

//Page setup for password change
app.get('/forgotpassword',(req,res)=>{
    res.render('forgotpassword',{
        title:'Password Change Page',
        message:'Change Your Scurely Password Here',
        name:'Harsh Gupta'
    })
})

//Page setup for password change
app.get('/createpassword',(req,res)=>{
    res.render('forgotpassword',{
        title:'Password Change Page',
        message:'Change Your Scurely Password Here',
        name:'Harsh Gupta'
    })
})

//Page setup for access denied
app.get('/Accessdenied',(req,res)=>{
    res.render('accessDenied',{
        title:403,
        message:'Access Denied',
        name:'Harsh Gupta'
    })
})

//Weather details fetcher
app.get('/weather',adminauth,async (req,res)=>{
    // console.log(req.headers)
    if(!req.query.address){
        return res.send({
            error:'No address provided'
        })
    }
    const query=await LocationSearched.findOne({location:req.query.address.toLowerCase()})
    if(!query){
    const newSearch=new LocationSearched({location:req.query.address.toLowerCase(),timesSearched:1})
    await newSearch.save()
    }else{
        query.timesSearched+=1
        await query.save()
    }
    // console.log('JUST BEFoRe GEOCODE')
    geocode(req.query.address,(error,{latitude,longitude,place:location}={})=>{
        if(error){
             return res.send({error})
        }
        // console.log('JUST BEFoRe forecast')
        forecast(latitude,longitude , (error, Forecastdata) => {
           if(error){
             return res.send({error:error.message})
            }
            // console.log('JUST BEFoRe send')
            res.send({
                forecast:Forecastdata.current.weather[0].description,
                current_temp:(Forecastdata.current.temp-273.15).toFixed(2),
                is_day:1,
                feelslike_c:(Forecastdata.current.feels_like-273.15).toFixed(2),
                location,
                icon:'http://openweathermap.org/img/wn/'+Forecastdata.current.weather[0].icon+'@2x.png',
                timestamp:Forecastdata.current.dt,
                current_text:Forecastdata.current.weather[0].main,
                address:req.query.address,
                latitude,
                longitude
            })
        })
     })
})

app.get('/searchget',async (req,res)=>{
    // console.log(req.headers)
    if(!req.query.query){
        return res.status(403).send({
            error:'No query provided'
        })
    }
    // console.log('JUST BEFoRe GEOCODE')
    searchserp(req.query.query,false,(error,{organic_results,local_results,total_time,ads,related_searches}={})=>{
        if(error){
             return res.status(error.code).send({error:error.info})
        }
        //Sending Pure Data Back
        // console.log('From app.js'+organic_results)
            res.status(200).send({     
                organic_results:organic_results,
                local_results:local_results,
                total_time:total_time,
                ads:ads,
                related_searches:related_searches,
            })
     })
})
/*##################################################
Get requests End here 
Post Requests Start here
###################################################*/

//Serving the userDatat Cookie to the front-end
app.post('/serveCookie',(req,res)=>{
    res.status(202).send(req.cookies)
})

//Serving the login Status of the user as true of false to the front end
app.post('/loginstatus',(req,res)=>{
    res.status(202).send(req.cookies.userData.isLoggedIn)
})

//recipe engne backend setup
app.post('/recipe',(req,res)=>{
    if(!req.body){
        return res.send({
            error:'No Ingredient provided'
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

//Signup page backend Setup
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

//Logn Page Backend
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

app.post('/loginfb',async(req,res)=>{
    try{
        const user= await USER.findByCredentialsfb(req.body.email)
        
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


//Logout Button Configuration
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

//Profile Page Back-End
app.patch('/profile',auth,async(req,res)=>{
    // console.log(req.body)
    const updates=Object.keys(req.body)
    const allowedUpdates = ['username','email','password','age','avatar']
    // console.log(updates)
    const isValid=updates.every((update)=>allowedUpdates.includes(update))
    if(!isValid){
        return res.status(400).send({error:'Invalid updates'})
    }
    try{
        // BYpasses middleware 
        // const user=await USER.findByIdAndUpdate(req.params.id,req.body,{new:true,runValidators :true})
        updates.forEach((update)=> {
            // console.log(req.body[update])
            return req.user[update]=req.body[update]
        })
        // console.log(req.user)
        const newLocal = await req.user.save()
        res.clearCookie('userData',{httpOnly:true})
        user=req.user
        token=req.token
        res.cookie("userData", {user,token,isLoggedIn:true},{maxAge: 900000000,httpOnly:true});
        res.status(200).send(req.user) 
    }catch(e){
        console.log('here')
        res.status(400).send(e)
    }
})

//configurng multer
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

//Profile-Pic sender from backend
app.post('/me/getavatars',auth,async (req,res)=>{
    try{
        // console.log(req.user.avatar)
        res.status(202).send({data:req.user.avatar})
    }catch{
        // console.log('Error')
        res.status(404).send('')
    }
})

//Profile-pic saver
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

//Profile-pic deleter(Not configured Yet)
app.delete('/me/avatars',auth,async (req,res)=>{
    req.user.avatar=undefined
    await req.user.save()
    res.send()
},(error,req,res,next)=>{
    res.status(400).send({error:error.message})
})

//Not working Yet GOOGLE SIGN IN
app.post('/checkGoogleId_Token',async(req,res)=>{
    const token=req.query.id_token
    console.log('token',token)
    async function verify() {
        console.log('inside verify')
        const ticket = await client.verifyIdToken({
            idToken: token,
            audience: process.env.Client_ID,  // Specify the CLIENT_ID of the app that accesses the backend
            // Or, if multiple clients access the backend:
            //[CLIENT_ID_1, CLIENT_ID_2, CLIENT_ID_3]
        });
        console.log(ticket)
        const payload = ticket.getPayload();
        const userid = payload['sub'];
        var data=await JSON.stringify({username:payload['name'],email:payload['email'],password:'123456789',age:payload['18']})
        console.log(data)
        const response=await fetch('/signup',{
            method:'POST',
            headers: {
                'Content-Type': 'application/json'
                // 'Content-Type': 'application/x-www-form-urlencoded',
              },
            body: data
        }).json()
        console.log(response)
        if(response.status==201){
            res.send('User authenticated')
        }else{
            res.send('Error')
        }
        // If request specified a G Suite domain:
        // const domain = payload['hd'];
      }
    verify().catch(console.error);  
})

//#######################################################
//Post requests end here
//Error 404 page setup
//#######################################################

//Error-404 page setup
app.get('*',(req,res)=>{
    res.render('error404',{
        title:404,
        message:'Page not found',
        name:'Harsh Gupta'
    })
})

//Strting up and listenng on the server (Development port:3000)
server.listen(port,()=>{
    console.log('Server is up on port '+port)
})
