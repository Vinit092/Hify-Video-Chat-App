import jwt from "jsonwebtoken";
import User from "../models/user.js";


export const protectRoute= async(req, res, next)=> {
    try {
        const token= req.cookies.jwt; 

    if(!token){
        return res.status(401).json({message: "Unauthorized access"});
    }

    const decoededToken = jwt.verify(token, process.env.JWT_SECRET_KEY);

    if(!decoededToken){
        return res.status(401).json({message: "Unauthorized access"});
    }

    const user= await User.findById(decoededToken.userId).select("-password");

    if(!user){
        res.status(401).json({message: "Unauthorized- user not found!"});
    }
    req.user= user;

    next();
    } catch (error) {
        console.log("Error in protectRoute middleware:", error);
        res.status(500).json({message: "Internal server error while protecting route"});
        
    }
}