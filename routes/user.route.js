import express from "express";
import { createUser,authenticateUser, removeUser,profile,verifyAccount } from "../controller/user.controller.js";
import { body } from "express-validator";
import { auth } from "../middleware/auth.js";
const router = express.Router();

router.post("/",
    body("name","name is required").notEmpty(),
    body("name","only alphabets are allowed").isAlpha(),
    body("email","email is requried").notEmpty(),
    body("email","invalid email").isEmail(),
    body("password","password is requried").notEmpty(),
    body("contact","contact is requried").notEmpty(),
    body("contact","only digit are allowed").isNumeric()
    ,createUser);
router.post("/authenticate",authenticateUser);
router.post("/verification",verifyAccount);
router.get("/profile",auth,profile);
router.post("/signout",auth,removeUser);
export default router;
