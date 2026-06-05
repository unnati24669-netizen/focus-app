
const mongoose=require("mongoose")
const schema=mongoose.Schema
const objectId=mongoose.Types. ObjectId

const userSchema=schema({
    email:{type:String,unique:true},
    firstName:{type:String,minlength:2,maxlength:15},
    lastName:{type:String,minlength:2,maxlength:15},
    password:{type:String,minlength:10,maxlength:100},
    googleAccessToken:{type:String},//when user login with google, we will get the access token and refresh token from google and store it in our database. We will use the access token to access the google calendar api and refresh token to get a new access token when the access token expires.
    googleRefreshToken:{type:String},//we cannot use anybody else google calendar so we need permission from user to access their google calendar. So when user login with google, we will get the access token and refresh token from google and store it in our database. We will use the access token to access the google calendar api and refresh token to get a new access token when the access token expires.
    googleTokenExpiry:{type:Date}


})

const todoSchema=schema({
    title:String,
    description:String,
    isDone:Boolean,
    userId:{type:schema.Types.ObjectId,ref:'user',required:true},
    priority:{type:Number,default:1}
})

const notesSchema=schema({
    title:String,
    description:String,
    userId:{type:schema.Types.ObjectId,ref:'user',required:true}
})
const calendarSchema=schema({
    title:String,
    date:{type:Date,required:true},
    time:String,
    userId:{type:schema.Types.ObjectId, ref:'user',required:true},  
    googleEventId:{type:String}//when you add or delete an event in calendar, you can use this id to add or delete the event in google calendar as well
})
const userModel=mongoose.model("user",userSchema)
const todoModel=mongoose.model("todo",todoSchema)
const notesModel=mongoose.model("notes",notesSchema)
const calendarModel=mongoose.model("calendar",calendarSchema)
module.exports={
    userModel,
    todoModel,
    notesModel,
    calendarModel
}