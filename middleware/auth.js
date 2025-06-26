import jwt from "jsonwebtoken";


export const auth =(request,response,next)=>{
    try{
        let {token} = request.cookies;
        console.log("Token = ",token);
        if(!token){
            return response.status(400).json({errorMessage:"unauthoreized user"});
        }
        let decode = jwt.verify(token,"fbffuierfhieurferfuiu");
        console.log(decode);
        request.user = {id: decode.userId, email: decode.email};
        next();
    }catch(err){
          console.log(err);
          return response.status(500).json({error:"Internal server Error...."});
    }
}