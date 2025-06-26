import { Types } from "mongoose";
import { Product } from "../model/product.model.js";

export const saveProducts =async (request,response,next)=>{
    try{
     let productList = request.body;
    //  let products = Product.bulkSave(productList);
    for(let product of productList){
        await Product.create(product);
    }
     return response.status(200).json({message:"all data saved"});

    }catch(err){
          console.log(err);
          return response.status(500).json({error:"Internal server error"});
    }
}

export const list = async(request,response,next)=>{
    try{
     let products = await Product.find();
     if(!products)return response.status(400).json({message:"product not found"});

    return response.status(200).json({message:"data fetch successully",products});

    }catch(err){
        console.log(err);
        return response.status(500).json({error:"internal server error"});
    }
}

export const findById = async(request,response,next)=>{
    try{
        let productId = request.params.id;

        let getProduct = await Product.findOne({_id: new Types.ObjectId(productId)});
        console.log("data............",getProduct);
         if(!getProduct) return response.status(401),json({message:"product not found"});
         return response.status(200).json({message:"product found",getProduct});
    }catch(err){
      console.log(err);
      return response.status(500).json({error:"Internal server error"});
    }
}

export const UpdateProduct = async(request,response,next)=>{
    try{
        let productId = request.params.id;

        let updateProduct = await Product.findOne({_id: new Types.ObjectId(productId)});
        
         if(!updateProduct) return response.status(401),json({message:"product not found"});
         return response.status(200).json({message:"product updated successfully!",updateProduct});
    }catch(err){
      console.log(err);
      return response.status(500).json({error:"Internal server error"});
    }
}

export const DeleteProduct = async(request,response,next)=>{
    try{
        let productId = request.params.id;

        let deleteProduct = await Product.findOne({_id: new Types.ObjectId(productId)});
        
         if(!deleteProduct) return response.status(401),json({message:"product not found"});
         return response.status(200).json({message:"product deleted successfully!"});
    }catch(err){
      console.log(err);
      return response.status(500).json({error:"Internal server error"});
    }
}

