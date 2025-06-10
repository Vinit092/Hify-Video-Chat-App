import User from "../models/user.js";
import frndReq from "../models/frndreq.js";
export async function recommendFrnds(req,res) {
    try {
        const curUserId= req.user._id;
        const curUser = req.user;

        const recommendedFrnds= await User.find({
            $and:[
                {_id: {$ne: curUserId}},
                {_id: {$nin: curUser.friends}},
                {isOnBoarded: true},
            ]
        });
        res.status(200).json(recommendedFrnds);

    } catch (error) {
        console.log("Error in recommendFrnds controller", error);
        res.status(500).json({message: "Internal server error while recommending friends"});
        
    }
}

export async function myFrnds(req,res) {
        try {
            const user= await User.findById(req.user._id).select("friends")
            .populate("friends","fullName profilePic nativeLanguage learningLanguage");

            res.status(200).json(user.friends);
        } catch (error) {
            console.log("Error in myFrnds controller", error.message);
            res.status(500).json({message: "Internal server error while fetching friends"});
            
        }
}

export async function friendRequest(req,res) {
    try {
        const myId= req.user._id;
        const {id: recipientId} = req.params;

        if(myId===recipientId) {
            return res.status(400).json({message: "You cannot send a friend request to yourself"});
        }

        const recipient = await User.findById(recipientId);

        if(!recipient){
            res.status(404).json({message: "Recipient not found"});
        }

        if(recipient.friends.includes(myId)) {
            return res.status(400).json({message: "You are already friends with this user"});
        }

        const existingRequest= await frndReq.findOne({
            $or:[
                {sender: myId, recipient: recipientId},
                {sender: recipientId, recipient: myId},
            ]
        });

        if(existingRequest){
            return res.status(400).json({message:"A friend request already exist between you and this user"});
        }

        const newfrndReq = await frndReq.create({
            sender: myId,
            recipient: recipientId,
        });

        res.status(201).json(newfrndReq);

    } catch (error) {
        console.log("Error in friendRequest controller", error.message);
        res.status(500).json({message: "Internal server error while sending friend request"});
        
    }
}

export async function acceptFriendRequest(req,res) {
    try {
        const {id: reqId}= req.params;
        const frndRequest= await frndReq.findById(reqId);
        
        if(!frndRequest) {
            return res.status(404).json({message: "Friend request not found"});
        }

        if(frndRequest.recipient.toString() !== req.user._id.toString()){
            return res.status(403).json({message: "You are not authorized to accept this friend request"});
        }

        frndRequest.status = "accepted";
        await frndRequest.save();

        // add each other to friends list

        // $addToSet used for adding items in array only if they are not already exist or added

        // this is for sender side to add recipient to sender's friends list
        await User.findByIdAndUpdate(frndRequest.sender,{
            $addToSet: {friends: frndRequest.recipient}
        });

        // this is for recipient side to add sender to recipient's friends list
        await User.findByIdAndUpdate(frndRequest.recipient,{
            $addToSet: {friends: frndRequest.sender}
        });

        res.status(200).json({message: "Friend request accepted!"});
    } catch (error) {
        console.log("Error in acceptFriendRequest controller", error.message);
        res.status(500).json({message: "Internal server error while accepting friend request"});
    }

}

export async function getFrndsReqs(req,res) {
    try {
         const incomingReqs= await frndReq.find({
        recipient: req.user._id,
        status: 'pending',
    }).populate('sender', 'fullName profilePic nativeLanguage learningLanguage');

    const acceptedReqs= await frndReq.find({
        sender: req.user._id,
        status: 'accepted',
    }).populate('recipient', 'fullName profilePic')
    
    res.status(200).json({
        incomingReqs,
        acceptedReqs
    });
    } catch (error) {
        console.log("Error in getFrndsReqs controller", error.message);
        res.status(500).json({message: "Internal server error while fetching friend requests"});
        
    }
}

export async function outGoingReqs(req,res) {
     try {
        const outGoingRequest= await frndReq.find({
        sender: req.user._id,
        status: 'pending',
     }).populate('recipient', 'fullName profilePic nativeLanguage learningLanguage');
        res.status(200).json(outGoingRequest);
     } catch (error) {
        console.log("Error in outGoingReqs controller", error.message);
        res.status(500).json({message: "Internal server error while fetching outgoing friend requests"});
        
     }
}   