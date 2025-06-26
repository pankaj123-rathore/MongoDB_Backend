import mongoose from "mongoose";

const categorySchema = new mongoose.Schema({
    slug:{
        type:String,
        required:true,
        unique:true
    },
    name:{
        type:String
    } 
});

export const Category = mongoose.model("category",categorySchema);