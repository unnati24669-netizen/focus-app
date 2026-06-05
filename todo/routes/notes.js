const express=require("express");

const jwt=require('jsonwebtoken');
const {auth}=require('../middleware/auth.js')
const {notesModel,userModel}=require('../models/db.js')
const {z} =require('zod')
const notesRouter=express.Router();

const requireBody=z.object({
        title:z.string().min(3),
        description:z.string().min(10),
      

    })

notesRouter.post("/",auth,async function(req,res){
    
    const Datasuccess=requireBody.safeParse(req.body);
    if(!Datasuccess.success){
        return res.json({
            message:'incorrect format'
        })
    }
    const {title,description}=req.body;
    const userId=req.userId;

    try{
        const note=await notesModel.create({
         title,
         description,
        
         userId,
      

    })
    res.json(note)
}catch(err){
    res.json({
        message:'insuccessful'
    })
}





    







})
notesRouter.put("/:id",auth,async function(req,res){
   
    const Datasuccess=requireBody.safeParse(req.body);
    if(!Datasuccess.success){
        return res.json({
            message:'incorrect format'
        })
    }
    const {title,description}=req.body;
    const userId=req.userId;
    const notesId=req.params.id;

    try{
        const note=await notesModel.findOneAndUpdate(
        {_id:notesId,userId:userId},
        {title,
         description,
         
         } ,
         {new:true}

    )
    res.json(note)
}
catch(err){
    res.json({
        message:'insuccessful'
    })
}





    







})
notesRouter.get("/",auth,async function(req,res){
   
    

    try{const notes=await notesModel.find(
        {userId:req.userId},
         

    )
    res.json({
    
        notes

    
})
}
catch(err){
    res.json({
        message:'insuccessful'
   
  })
}
})

notesRouter.delete("/:id",auth,async function(req,res){
   
    

    try{const notes=await notesModel.deleteOne(
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
module.exports=notesRouter





    








