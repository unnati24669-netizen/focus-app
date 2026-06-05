const express=require("express")

const userRouter=express.Router();

const {auth}=require("../middleware/auth")
const {userModel}=require("../models/db")
const bcrypt=require("bcrypt")
const {z}=require("zod");
const jwt=require("jsonwebtoken");
const JWT_SECRET=process.env.JWT_SECRET;
const requiredBody=z.object({
    email:z.string().min(4).max(50).email(),
    firstName:z.string().min(3).max(50),
    lastName:z.string().min(3).max(50),
    password:z.string().min(8).max(50)
})


userRouter.post("/signup",async function(req,res){
    const givenbody=requiredBody.safeParse(req.body);
    if(!givenbody.success){
        return res.status(401).json({
            message:"invalid credentials"
        })
    }
    const {email,firstName,lastName,password}=req.body;
    try{
        const finding=await userModel.findOne({
        email:req.body.email
    })
    if(finding){
        return res.json({
            message:"User already exist"
        })
    }
    }
    catch(err){
        return res.json({
            message:"error occured"
        })
    }
    
    
    try{
         const hashedpassword=await bcrypt.hash(password,10);
         await userModel.create({
        email:email,
        firstName:firstName,
        lastName:lastName,
        password:hashedpassword
    })

        return res.json({
            message:"signup successful"
        })
    
    }
    catch(err){
        return res.json({
            message:"so error occurred"
        })
    }
    
        

    
    

    






})
const signinBody=z.object({
    email:z.string().min(3).max(50).email(),
    password:z.string().min(8).max(50)
})
userRouter.post("/signin",async function(req,res){
    const givenbody=signinBody.safeParse(req.body);
    if(!givenbody.success){
         return res.json({
            message:"incorrect format"
         })
    }
    const {email,password}=req.body;

    try{
        const person=await userModel.findOne({
            email:email
        })
        if(!person){
            return res.json({
                message:"error occurred"
            })
        }

        const val=await bcrypt.compare(password,person.password);
        if(!val){
            return res.json({
                message:"error occurred"
            })
        }


        const token=jwt.sign({userId:person._id},JWT_SECRET)
        return res.json({
            token
        })

    }catch(err){
        return res.json({
           message:"incorrect credentials"
        })
    }
    




})
module.exports=userRouter
