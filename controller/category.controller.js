import { Category } from "../model/category.model.js";

export const saveCategory = async(request,response,next)=>{
    try{
        let categoryList = request.body;

     for(let category of categoryList){
         await Category.create(category);
     }
     return response.status(200).json({message:"All Category Saved.."});

    }catch(err){
        return response.status(500).json({error: "Internal Server Error"});
    }
}