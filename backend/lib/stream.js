import {StreamChat} from "stream-chat";
import "dotenv/config";

const apiKey = process.env.STREAM_API_KEY;
const apiSecret = process.env.STREAM_SECRET_KEY;

if(!apiKey || !apiSecret){
    console.error("Stream API key or secret key is missing!");
}

    const client= StreamChat.getInstance(apiKey, apiSecret);

    export const upsertClient= async (userData)=>{
        try {
            await client.upsertUsers([userData]);
            return userData;
        } catch (error) {
            console.log("Error in upserting user to Stream:", error);
            
        }
    }

    export const generateToken= (userId)=>{
      try {
        const userStr = userId.toString();
        return client.createToken(userStr);
      } catch (error) {
        console.log("Error in generating token for Stream:", error);
        
        
      }  
    };