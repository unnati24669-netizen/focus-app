const jwt=require("jsonwebtoken")

function auth(req,res,next){
    const JWT_SECRET=process.env.JWT_SECRET
    const token=req.headers.authorization?.split(" ")[1];
    if(!token){
        return res.status(401).json({
            message:"no token provided"
        })
    }
    try{
        const decoded=jwt.verify(token,JWT_SECRET);
        req.userId=decoded.userId;
        next();
    }
    catch(err){
         res.status(403).json({
            message:"invalid credentials"

        })
    }
    
    

}

module.exports={
    auth
}