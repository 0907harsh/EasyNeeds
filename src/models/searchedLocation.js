const mongoose=require('mongoose')
const validator=require('validator')

const LocationSchema= new mongoose.Schema({
    location:{
        type:String,
        required:true,
        trim:true
    },
    timesSearched:{
        type: Number,
        default:0
    },
},{
    timestamps:true
})

const Location=mongoose.model('SearchedLocation',LocationSchema)

module.exports = Location 