import User from "../models/user.js";
import jwt from "jsonwebtoken";
import { upsertClient } from "../lib/stream.js";
export async function signup(req,res) {
    const {fullName,email,password}=req.body;

    try {
        if(!fullName || !email || !password){
        return res.status(400).json({message: "Please fill all the fields"});
    }

    if(password.length <8){
        return res.status(400).json({message: "Password must be at least 8 characters long"});
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailRegex.test(email)) {
     return res.status(400).json({ message: "Invalid email format" });
    }

    const existingUser= await User.findOne({email});
    if(existingUser){
        return res.status(400).json({message: "User already exists with this email"});
    }

    const numidx=Math.floor(Math.random()*100)+1;
    const randomAvtar=`https://avatar.iran.liara.run/public/${numidx}.png`;

    const newUser= await User.create({
        fullName,
        email,
        password,
        profilePic: randomAvtar,
    });

    // here we are getting user info for register user in stream for chat and video call
        try {
            await upsertClient({
                id: newUser._id.toString(),
                name: newUser.fullName,
                image: newUser.profilePic || "",
            });
            console.log(`created user in stream: ${newUser.fullName}`);
            
        } catch (error) {
            console.log("Error in upserting user to Stream:", error);
            return res.status(500).json({message: "Internal server error while creating user in Stream"});
         }

    // here we are generating jwt token for user


    const token= jwt.sign({userId: newUser._id},process.env.JWT_SECRET_KEY,{expiresIn: '7d'});

    // here we are storing the token in cookie

    res.cookie('jwt',token,{
        maxAge: 7 * 24 * 60 * 60 * 1000,
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
    });

    res.status(201).json({success: true, user: newUser});

    } catch (error) {
        console.log("Error in signup controller", error);
        res.status(500).json({message: "Internal server error"});
    }
    
}

export async function login(req,res)  {
    try {
        const {email, password} = req.body;
        if (!email || !password) {
            return res.status(400).json({message: "Please fill all the fields"});
        }
        const user= await User.findOne({email});
        if(!user) 
            return res.status(401).json({message: "Invalid password or email!"});
        const isMatch= await user.comparePassword(password);
        if(!isMatch)
            return res.status(401).json({message: "Invalid password or email!"});

          const token= jwt.sign({userId: user._id},process.env.JWT_SECRET_KEY,{expiresIn: '7d'});

        res.cookie('jwt',token,{
        maxAge: 7 * 24 * 60 * 60 * 1000,
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
    });

    res.status(201).json({success: true, user});
    } catch (error) {
        console.log("Error in login controller", error);
        res.status(500).json({message: "Internal server error"});
        
        
    }
}

export function logout(req,res)       {
    res.clearCookie('jwt');
    res.status(200).json({message: "Logged out successfully"});
}

export async function onboard(req,res){
    try {
        const userId=req.user._id;
        const {fullName,bio,nativeLanguage, learningLanguage, city}= req.body;

        if(!fullName || !bio || !nativeLanguage || !learningLanguage || !city){
            return res.status(400).json({
                message: "Please fill all the fields",
                missionFields:[
                    !fullName && "fullName",
                    !bio && "bio",
                    !nativeLanguage && "nativeLanguage",
                    !learningLanguage && "learningLanguage",
                    !city && "city",
                ].filter(Boolean),
            });
        }
        const updatedUser= await User.findByIdAndUpdate(userId,{
            ...req.body,
            isOnBoarded: true,
        },{new:true})
    
        if(!updatedUser){
            return res.status(404).json({message: "User not found"});
        }

        try {
            await upsertClient({
                id: updatedUser._id.toString(),
                name: updatedUser.fullName,
                image: updatedUser.profilePic || "",
            })
            console.log(`updated user in stream: ${updatedUser.fullName}`);
        } catch (streamError) {
            console.log("Error in upserting user to Stream during onboarding:", streamError,message);
            
        }

        res.status(200).json({success: true, user: updatedUser});

    } catch (error) {
        console.log("Error in onboard controller", error);
        res.status(500).json({message: "Internal server error"});
        
    }
}