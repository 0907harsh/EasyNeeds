const mongoose=require('mongoose')
// const validator=require('validator') as it is not used

//creating location schema
const LocationSchema= new mongoose.Schema({
    location:{
        type:String,
        required:true,
        trim:true
    },
    timesSearched:{//to store the frequency of the search 
        type: Number,
        default:0
    },
},{
    timestamps:true
})

//creating location model
const Location=mongoose.model('SearchedLocation',LocationSchema)

//exporting location-model
module.exports = Location 