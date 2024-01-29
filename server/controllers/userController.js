import bcryptjs from "bcryptjs";
import jwt from "jsonwebtoken";
import validator from "validator";
import crypto from "crypto"

import User from "../models/userModel.js";
import EmailToken from '../models/emailToken.js'
import { sendEmail } from '../utils/sendEmail.js'

//JWT
const createToken = (_id) => {
    const token = jwt.sign({ _id }, process.env.JWT_SECRET, { expiresIn: "3h" });
    return token;
};

//REGISTER
export const signup = async (req, res) => {
    const { firstName, lastName, username, email, password } = req.body;

    try {
        let user = await User.findOne({ email });
        let uname = await User.findOne({ username });

        if (user) {
            return res.status(400).json({ message: "Email already in use..." });
        }
        if (uname) {
            return res.status(400).json({ message: "Username is already taken!"})
        }
        if (!firstName || !lastName ||  !username || !email || !password) {
            return res.status(400).json({ message: "All fields are required..." });
        }
        if (!validator.isEmail(email)) {
            return res.status(400).json({ message: "Invalid Email Address..." });
        }
        if (!validator.isStrongPassword(password)) {
            return res.status(400).json({ message: "Password must me a strong password..." });
        }

        const hashedPassword = bcryptjs.hashSync(password, 10);
        let newUser = new User({ firstName, lastName, username, email, password: hashedPassword });

        await newUser.save();

        const emailToken = await new EmailToken({
            userId: newUser._id,
            emailToken: crypto.randomBytes(32).toString("hex")
        }).save()

        const url = `http://localhost:5173/users/${newUser._id}/verify/${emailToken.emailToken}`;

        await sendEmail(newUser.email, "Verify Email", url)


        res.status(201).json({
            _id: newUser._id,
            firstName,
            lastName, 
            username,
            email,
            message: "Verification link has been sent to your Email",
            signup:true,
        });
    } catch (error) {
        console.log(error);
        res.status(500).json(error)
    }
};

//EMAIL VERIFICATION
export const verifyEmail = async (req, res) => {
    try {
        const user = await User.findOne({ _id: req.params.id })
        console.log("*******************",user);

        if(!user){
            return res.status(400).json({ message: "Invalid link"})
        }
        const emailToken = await EmailToken.findOne({
            userId: user._id,
        })
        console.log("*******************",emailToken);

        if(!emailToken){
            return res.status(400).json({ message: "Invalid link"})
        }
        if (emailToken.emailToken !== req.params.token) {
            return res.status(400).json({ message: "Invalid link" });
        }
        await EmailToken.updateOne({ userId: user._id }, { used: true });


        await User.updateOne({ _id: user._id }, { verified: true })
        // await emailToken.delete()

        res.status(200).json({ message: "Email verified" })

    } catch (error) {
        console.log(error);
        res.status(500).json(error)
    }
};

//LOGIN
export const login = async (req, res) => {
    const { username, password } = req.body;
    try {
        let user = await User.findOne({ username });
        // console.log(user);
        
        if (!user) {
            return res.status(404).json({ message: "User not found..." });
        }
        const isValidPassword = await bcryptjs.compare(password, user.password)
        if(!isValidPassword){
            return res.status(401).json({ message:"Invalid Password" })
        }
        if(!user.verified){
            let emailToken = await EmailToken.findOne({ userId: user._id })
                
            console.log( emailToken );
        
            const url = `http://localhost:5173/users/${user._id}/verify/${emailToken.emailToken}`;
        
            await sendEmail(user.email, "Verify Email", url)
            
            return res.status(400).json({ message: "Email not verified: Verification link has been sent to your account"})
        }
        //create the jwt token and send it to the client side
        const token = createToken(user._id);
        res.status(200).json({
            _id : user._id ,
            username,
            token,
            message:'Logged in successfully',
            login: true,
        })

    }catch (error) {
        console.log(error);
        res.status(500).json(error)
    }
};

//FORGOT PASSWORD
export const forgotPassword = async (req, res) => {
    const { username, email } = req.body;

    try {
        let user = await User.findOne({ username });
        console.log(user);

        if( !user || user.email !== email || user.username !== username){
            return res.status(404).json({ message: "User not found..." });
        }
        res.status(200).json({
            username,
            message:'user exists',
            resetPassword: true,
        })

    }catch (error) {
        console.log(error);
        res.status(500).json(error)
    }
};

//SEARCH
export const findUser = async (req,res)=>{
    const userId = req.params.userId;
    try {
        const user = await User.findById( userId ).select("-password")
        res.status(200).json(user);

    } catch (error) {
        console.log(error);
        res.status(404).json(error)
    }
};


export const getUsers = async (req,res)=>{
    try {
        const users = await User.find().select("-password")
        res.status(200).json(users);

    } catch (error) {
        console.log(error);
        res.status(404).json(error)
    }
};


