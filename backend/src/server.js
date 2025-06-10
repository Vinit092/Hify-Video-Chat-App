import express from 'express';
import "dotenv/config";
import authRoutes from "../routes/auth.routes.js";
import userRoutes from "../routes/user.routes.js";
import { connectDB } from '../lib/db.js';
import cookieParser from 'cookie-parser';
import chatRoutes from '../routes/chat.routes.js';
import cors from 'cors';
import path from 'path';

const app= express();
const PORT= process.env.PORT;

const _dirname=path.resolve();

app.use(cors({
    origin: "http://localhost:5173",
    credentials: true,
}))
app.use(cookieParser());
app.use(express.json());


app.use("/api/auth", authRoutes);
app.use("/api/users",userRoutes);
app.use("/api/chat",chatRoutes);

if(process.env.NODE_ENV ==='production'){
    app.use(express.static(path.join(_dirname,'../frontend/dist')));

    app.get("*",(req,res)=>{
        res.sendFile(path.join(_dirname,'../frontend','dist','index.html'));
    })
}
app.listen(PORT, ()=>{
    console.log(`Server is running on port ${PORT}`);
    connectDB();
});