import { validationResult } from "express-validator";
import { User } from "../model/user.model.js";
import { Types } from "mongoose";
import nodemailer from "nodemailer";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import dotenv from "dotenv";
dotenv.config();

export const createUser = async (request, response, next) => {
    try {
        const errors = validationResult(request);
        if (!errors.isEmpty())
            return response.status(400).json({ error: "Bad request", errorMessages: errors.array() });
        let { password, name, contact, email } = request.body;
        const saltKey = bcrypt.genSaltSync(12);
        password = bcrypt.hashSync(password, saltKey);
        let result = await User.create({ name, password, contact, email });
        await sendEmail(email,name);
        return response.status(201).json({ message: "user created", user: result });
    }
    catch (err) {
        return response.status(500).json({ error: "Internal Server Error" });
    }
}

export const verifyAccount = async (request, response, next) => {
    try {
        let { email } = request.body;
        console.log("Email Verify = ",email);
        
        let result = await User.updateOne({ email },{ $set: { isVerified: true } } );
        console.log(result);
        return response.status(200).json({ message: "Account verified Successfully" ,result});
    } catch (err) {
        console.log(err);
        return response.status(500).json({ error: "Internal server error" });
    }
}

export const authenticateUser = async (request, response, next) => {
    try {
        let { email, password } = request.body;
       
        let user = await User.findOne({ email });
        
        if (!user.isVerified)
            return response.status(401).json({ error: "Unauthorized user | Account not varified" });
        
        if (!user) 
            return response.status(401).json({ error: "Unauthorized user | Email not found" });
        
        let status = await bcrypt.compare(password, user.password);
         console.log("status : ",status);
        user.password = undefined;

        status && response.cookie("token", genrateToken(user._id, user.emaiId, user.contact ));

        return status ? response.status(200).json({ message: "sign in success", user }) : response.status(400).json({ error: "Unauthorized User | Invalid Password" });
    } catch (err) {
        console.log(err);
        return response.status(500).json({ error: "Internal server error" });
    }
}

export const profile = async (request, response, next) => {
    try {
        const userId = request.user.userId;
        console.log(userId);
        
        let userProfile = await User.findOne({ _id: new Types.ObjectId(userId) }, { _id: false, name: true, email: true, contact: true });
        console.log("user proflile : ", userProfile);

        if (!userProfile) {
            return response.status(401).json({ error: "user not found...." });
        }
        return response.status(200).json({ message: "user found.", user: userProfile });
    } catch (err) {
        console.log(err);
        return response.status(500).json({ error: "Internal server error" });
    }
}

export const removeUser = (request, response, next) => {
    try {
        response.clearCookie("token");
        return response.status(200).json({ message: "sign out successfull" });
    } catch (err) {
        console.log(err);
        return response.status(500).json({ error: "Internal server error" });
    }
}

export const sendEmail = (email, name) => {
    return new Promise((resolve, reject) => {
        let transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: process.env.EMAIL,
                pass: process.env.EMAIL_PASSWORD
            }
        });

        let mailOptions = {
            from: process.env.EMAIL,
            to: email,
            subject: 'Account verifiacation',
            html: `<h4>Dear ${name}</h4>
            <p>Thankyou for registrataion. To verify account please click on the Buttom</p>
            <form method="post" action="http://localhost:3000/user/verification">
            <input type="hidden" name="email" value="${email}"/>
            <button type="submit" style="background-color: blue; color: white; width:200px; border:none; border:1px solid grey; border-radius: 10px">Verify</button>
            </form>
            <p>
            <h6>Thank you</h6>
            backend Api Team.
            </p>`
        };

        transporter.sendMail(mailOptions, function (error, info) {
            if (error) {
                reject(error);
            } else {
                resolve();
            }
        })
    })
}

export const genrateToken = (userId, email,contact) => {
    let payload = { userId, email,contact };
    let token = jwt.sign(payload, "fbffuierfhieurferfuiu");
    console.log(token);
    return token;
}