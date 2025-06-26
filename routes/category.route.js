import express from "express";
import { saveCategory } from "../controller/category.controller.js";
const router = express.Router();


router.post("/",saveCategory);

export default router;