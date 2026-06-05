const cors=require("cors")
const express=require("express")
const mongoose=require("mongoose")
const dotenv=require("dotenv")
dotenv.config()

const app=express()
app.use(cors({
    origin:["http://localhost:5173","https://accounts.google.com"],
    credentials:true
}))
const userRoute=require("./routes/user")
const calendarRoute=require("./routes/calendar")
const todoRoute=require("./routes/todo")
const notesRoute=require("./routes/notes")



app.use(express.json())
app.use("/api/user",userRoute)
app.use("/api/todo",todoRoute)
app.use("/api/calendar",calendarRoute)
app.use("/api/notes",notesRoute)


    mongoose.connect(process.env.MONGO_URL).then(()=>console.log("connected"))
    .catch((err)=>console.log("error",err))


console.log(process.env.GOOGLE_REDIRECT_URI)
app.listen(process.env.PORT);


