const mongoose=require('mongoose')
const validator=require('validator')
const bcrypt=require('bcryptjs')
const jwt=require('jsonwebtoken')
//creating user schema
const userSchema=new mongoose.Schema({
    name:{
        type: String,
        trim:true
    },
    password:{
        type:String,
        required:true,
        minlength:6,
         trim:true,
        validate(value){
            if(value.toLowerCase().includes('password')){
                throw new Error('\'Password\' cannot be use as password')
            }
        }
    },
    age:{
        type: Number,
        default:0,
        validate(value){
            if(value<0){
                throw new Error('Age must be > 0')
            }
        }
    },
    tokens:[{
        token:{
            type:String,
            required:true
        }
    }]
},{
    timestamps:true
})
//Two argument available with midldeware in mongoose
// pre-before event is done
// post-after event is done




//availableo USER
userSchema.statics.findByCredentials = async(email,password)=>{
    const user =await USER.findOne({email})
    if(!user){
        throw new Error('Unable to login')
    }
    const ismatch=await bcrypt.compare(password,user.password)
    if(!ismatch){
        throw new Error('Unable to login')
    }
    return user
}

//available on user
userSchema.methods.generateAuthToken=async function(){
    const user=this
    const token = jwt.sign({_id:user.id.toString()},'YouAreAUser')
    user.tokens=user.tokens.concat({token})
    await user.save()
    return token
}

userSchema.methods.toJSON=function(){
    const user=this
    const userPublic = user.toObject()
    delete userPublic.password
    delete userPublic.tokens
    return userPublic
}

//hash plain text passowrd before saving
userSchema.pre('save',async function(next){
    if(this.isModified('password')){
        this.password=await bcrypt.hash(this.password,8)
    }
    next()//to be given at the end
})

//delete user tasks before removing user
userSchema.pre('remove',async function(next){
    const user = this
    await TASK.deleteMany({'creatorId':user._id})
    next()//to be given at the end
})


const USER=mongoose.model('USERS',userSchema)




module.exports = USER
