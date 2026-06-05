const express=require("express");

const todoRouter=express.Router();
const jwt=require('jsonwebtoken');
const {auth}=require('../middleware/auth.js')
const {todoModel,userModel}=require('../models/db.js')
const {z} =require('zod');



const requireBody=z.object({
        title:z.string().min(3),
        description:z.string().min(10),
        isDone:z.boolean().default(false),
        priority:z.number()

    })

todoRouter.post("/",auth,async function(req,res){
    
    const Datasuccess=requireBody.safeParse(req.body);
    if(!Datasuccess.success){
        return res.json({
            message:'incorrect format'
        })
    }
    const {title,description,isDone,priority}=req.body;
    const userId=req.userId;

    try{
        const todo=await todoModel.create({
         title,
         description,
         isDone,
         userId,
         priority

    })
    res.json(todo)
}catch(err){
    res.json({
        message:'insuccessful'
    })
}





    







})
todoRouter.put("/:id",auth,async function(req,res){
   
    const Datasuccess=requireBody.safeParse(req.body);
    if(!Datasuccess.success){
        return res.json({
            message:'incorrect format'
        })
    }
    const {title,description,isDone,priority}=req.body;
    const userId=req.userId;
    const todoId=req.params.id;

    try{
        const updatedTodo=await todoModel.findOneAndUpdate(
        {_id:todoId,userId:userId},
        {title,
         description,
         isDone,
         userId,
         priority},
         {new:true}

    )
    res.json(updatedTodo)
}

catch(err){
    res.json({
        message:'insuccessful'
    })
}





    







})
todoRouter.get("/",auth,async function(req,res){
   
    

    try{const todos=await todoModel.find(
        {userId:req.userId},
         

    )
    res.json(todos

    
)
}
catch(err){
    res.json({
        message:'insuccessful'
    
  })
}
})

todoRouter.delete("/:id",auth,async function(req,res){
   
    

    try{const todos=await todoModel.deleteOne(
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

todoRouter.patch("/:id",auth,async function(req,res){
    const todoId=req.params.id;
    const userId=req.userId;

    try{
        const toggletodo=await todoModel.findOne({_id:todoId,userId:userId})
        if(!toggletodo){
            return res.status(404).json({message:"todo not found"})
        }
        toggletodo.isDone=!toggletodo.isDone;
        await toggletodo.save();
        res.json(toggletodo)
    }
    catch(err){
        res.json({
            message:'insuccessful'
        })
    }
})

module.exports=todoRouter





    








