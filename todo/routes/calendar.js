const express=require("express");

const jwt=require('jsonwebtoken');
const {google} =require('googleapis');
function getOAuthClient(){
    return new google.auth.OAuth2(
        process.env.GOOGLE_CLIENT_ID,//this funtion is used to talk to google api. So we need to provide the client id, client secret and redirect uri which we get from google cloud console when we create a project and enable the google calendar api.
        process.env.GOOGLE_CLIENT_SECRET,
        process.env.GOOGLE_REDIRECT_URI
    )
}
    

const {auth}=require('../middleware/auth.js')
const {calendarModel,userModel}=require('../models/db.js')
const {z} =require('zod');
const { get } = require("mongoose");
const calendarRouter=express.Router()


const requiredBody=z.object({
        title:z.string().min(3),
        date:z.string(),
        time:z.string()
      

    })

calendarRouter.post("/",auth,async function(req,res){

    const Datasuccess=requiredBody.safeParse(req.body);
    if(!Datasuccess.success){
        return res.json({
            message:'incorrect format'
        })
    }
    const {title,date,time}=req.body;
    const userId=req.userId;
    
    let googleEventId=null;
    try{

        const user=await userModel.findById(userId);

    if(user.googleAccessToken){
        const oauth=getOAuthClient();
        oauth.setCredentials({
            access_token:user.googleAccessToken,
            refresh_token:user.googleRefreshToken,
            expiry_date:user.googleTokenExpiry
        })

        const googleCalendar=google.calendar({version:'v3',auth:oauth});
        const startTime=new Date(`${date}T${time}:00`);
        const endTime=new Date(startTime.getTime()+60*60*1000);

        const googleEvent=await googleCalendar.events.insert({
            calendarId:"primary",
            requestBody:{
                summary:title,
                start:{
                    dateTime:startTime.toISOString(),timeZone:"Asia/Kolkata"
                },
                end:{
                    dateTime:endTime.toISOString(),timeZone:"Asia/Kolkata"  
                }
            }
        })
         googleEventId=googleEvent.data.id;
    }

   

    const calendar=await calendarModel.create({
        title,date,time,userId,googleEventId
    })
    res.json(calendar)
}

catch(err){
    res.json({
        message:'insuccessful'
    })
}





    







})
calendarRouter.put("/:id",auth,async function(req,res){
    const Datasuccess=requiredBody.safeParse(req.body);
    if(!Datasuccess.success){
        return res.json({
            message:'incorrect format'
        })
    }
    const {title,date,time}=req.body;
    const userId=req.userId;

    try{const updatedCalendar=await calendarModel.findOneAndUpdate(
        {_id:req.params.id,userId:userId},
        {title,
        date,
        time,
         
         userId,
         } ,
         {new:true}

    )
    const user=await userModel.findById(userId);

    if(user.googleAccessToken&&updatedCalendar.googleEventId){
        const oauth=getOAuthClient();
        oauth.setCredentials({
            access_token:user.googleAccessToken,
            refresh_token:user.googleRefreshToken,
            expiry_date:user.googleTokenExpiry
        })

        const googleCalendar=google.calendar({version:'v3',auth:oauth});
        const startTime=new Date(`${date}T${time}:00`);
        const endTime=new Date(startTime.getTime()+60*60*1000);

        const googleEvent=await googleCalendar.events.update({
            calendarId:"primary",
            eventId:updatedCalendar.googleEventId,
            requestBody:{
                summary:title,
                start:{
                    dateTime:startTime.toISOString(),timeZone:"Asia/Kolkata"
                },
                end:{
                    dateTime:endTime.toISOString(),timeZone:"Asia/Kolkata"  
                }
            }
        })
    }
    res.json(updatedCalendar)
}

catch(err){
    res.json({
        message:'insuccessful'
    })
}
   
    




    







})
calendarRouter.get("/",auth,async function(req,res){
   
    

    try{const event=await calendarModel.find(
        {userId:req.userId},
         

    )
    res.json(event)
}
catch(err){
    res.json({
        message:'insuccessful'
   
  })
}
})

calendarRouter.delete("/:id",auth,async function(req,res){
   
    

    try{
        const event=await calendarModel.findOne(
        {_id:req.params.id,userId:req.userId}
         

    )

    const user= await userModel.findById(req.userId);

    if(user.googleAccessToken&&event?.googleEventId){
        const oauth=getOAuthClient();
        oauth.setCredentials({
            access_token:user.googleAccessToken,
            refresh_token:user.googleRefreshToken,
            expiry_date:user.googleTokenExpiry  
        })

        const googleCalendar=google.calendar({version:'v3',auth:oauth});

        await googleCalendar.events.delete({
            calendarId:"primary",
            eventId:event.googleEventId,

        })

    }

    await calendarModel.deleteOne(
        {_id:req.params.id,userId:req.userId}
         

    )

    res.json({_id:req.params.id})
}
catch(err){
    res.json({
        message:'insuccessful'
    })
}
})

calendarRouter.get("/connect",auth,(req,res)=>{
    const oauth=getOAuthClient();

    const url=oauth.generateAuthUrl({
        access_type:"offline"  ,//we are using offline access type because we want to get the refresh token from google when user gives us permission to access their google calendar. We will use this refresh token to get a new access token when the access token expires. If we use online access type, then we will not get the refresh token from google and we will not be able to access the user's google calendar after the access token expires.
        prompt:"consent",//we are using prompt consent because we want to get the refresh token from google every time user gives us permission to access their google calendar. If we do not use prompt consent, then we will get the refresh token from google only the first time user gives us permission to access their google calendar. After that, we will not get the refresh token from google and we will not be able to access the user's google calendar after the access token expires.
        scope:[
            "https://www.googleapis.com/auth/calendar",
            "https://www.googleapis.com/auth/calendar.events"

        ],
        state:req.userId//we are sending the user id in the state parameter so that we can identify which user has given us permission to access their google calendar when we receive the callback from google after user gives us permission to access their google calendar.

    
    })
    res.json({url});
})

calendarRouter.get("/callback",async(req,res)=>{
    const{code,state:userId}=req.query//when user gives us permission to access their google calendar, google will redirect the user to this callback url with the authorization code and the state parameter that we have sent in the generateAuthUrl function. We will use this authorization code to get the access token and refresh token from google and store it in our database for future use.
     
    try{
        const oauth=getOAuthClient();

        const {tokens}=await oauth.getToken(code);//we are exchanging the authorization code that we have received from google for the access token and refresh token. We will use these tokens to access the user's google calendar in the future.
        
        await userModel.findByIdAndUpdate(
            userId,{
                googleAccessToken:tokens.access_token,
                googleRefreshToken:tokens.refresh_token,
                googleTokenExpiry:new Date(tokens.expiry_date)
            }
        )
        res.redirect("http://localhost:5173/calendar?connected=true")//after storing the access token and refresh token in our database, we are redirecting the user to the calendar page of our frontend where they can see their google calendar events along with their local events that we have stored in our database.
    
    }catch(err){
        console.log(err)
        res.redirect("http://localhost:5173/calendar?connected=false")//if there is an error while exchanging the authorization code for the access token and refresh token or while storing the tokens in our database, then we are redirecting the user to the calendar page of our frontend with a query parameter connected=false so that we can show an error message to the user on the frontend.
    }
})
module.exports=calendarRouter





    








