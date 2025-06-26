import express from "express";
import { saveProducts,list, findById ,UpdateProduct,DeleteProduct} from "../controller/product controller.js";
import { auth } from "../middleware/auth.js";


const router = express.Router();
router.post("/",saveProducts);
router.get("/",list);
router.get("/:id",findById);
router.put("/:id",UpdateProduct);
router.delete("/:id",DeleteProduct);

export default router;