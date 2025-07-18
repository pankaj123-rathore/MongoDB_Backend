import express from "express";
import mongoose from "mongoose";
import bodyParser from "body-parser";
import cookieParser from "cookie-parser";
import cors from "cors";
import userRouter from "./routes/user.route.js";
import productRouter from "./routes/product.route.js";
import categoryRouter from "./routes/category.route.js";
import dotenv from "dotenv";
dotenv.config();

const app = express();

mongoose.connect(process.env.DB_URL)
.then(result=>{
    app.use(cors());
    app.use(cookieParser());
    app.use(bodyParser.json());
    app.use(bodyParser.urlencoded({extended:true}));
    app.use("/user",userRouter);
    app.use("/product",productRouter);
    app.use("/category",categoryRouter);
    app.listen(process.env.PORT,()=>{
        console.log("Server started...");
    })
}).catch(err=>{
    console.log(err);
    console.log("Database Connection failed..");
});