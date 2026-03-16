import userModel from "../models/user.model.js"
import crypto from "crypto"
import jwt from "jsonwebtoken"
import config from "../config/config.js"
import { decode } from "punycode"


export async function register(req, res) {

    const { username, email, password } = req.body

    const isAlreadyRegister = await userModel.findOne({
        $or: [{ username }, { email }]
    })

    if (isAlreadyRegister) {
        res.status(409).json({
            msg: "username already exixts.."
        })
    }

    const hashedPassword = crypto.createHash("sha256").update(password).digest("hex");
    const user = await userModel.create({
        username,
        email,
        password: hashedPassword
    })

    const accessToken = jwt.sign({
        id: user._id
    }, config.JWT_SECRET,
        { 
            expiresIn: "15m" 
        }
    )

    const refreshToken = jwt.sign({
        id:user._id
    },config.JWT_SECRET,
    {
        expiresIn:"7d"
    }
    )

    res.cookie("refreshToken", refreshToken,{
        httpOnly:true,
        secure:true,
        sameSite:"strict",
        maxAge:7*24*60*60*1000
    })


    res.status(201).json({
        msg: "user registered suuccessfully..",
        user: {
            username: user.username,
            email: user.email,
        },
        token:accessToken
    })
}


export async function getMe(req, res) {

    console.log("get me method is called...");

    const token = req.headers.authorization?.split(" ")[1]

    if (!token) {
        return res.status(401).json({
            message: "token not found"
        })
    }

    // { id: '69b785d5277f217d7feba5bf', iat: 1773635029, exp: 1773721429 }
    const decoded = jwt.verify(token, config.JWT_SECRET) // returning an object
    console.log(decoded);

    const user = await userModel.findById(decoded.id)

    if(!user){
        console.log("user not found..");
        
        res.status(404).json({
            msg:"user not found"
        })
    }
    console.log("User:", user);
    

    res.status(200).json({
        message: "user fetch successfyllyyy",
        user: {
            username: user.username,
            email: user.email
        },
    })
}

 
export async function refreshToken(req, res) {
    
    const refreshToken = req.cookies.refreshToken

    if(!refreshToken){
        return res.status(404).jsno({
            message:"Refresh Token not found."
        })
    }

    const decoded = jwt.verify(refreshToken, config.JWT_SECRET)

    const accessToken = jwt.sign({
        id:decoded.id
    }, config.JWT_SECRET, {
        expiresIn:"15m"
    })

    const newRefreshToken = jwt.sign({
        id:decoded.id
    }, config.JWT_SECRET, {
        expiresIn:"7d"
    }) 

    res.cookie("refreshToken", newRefreshToken,{
        httpOnly:true,
        secure:true,
        sameSite:"strict",
        maxAge:7 * 24 * 60 * 60 * 1000// 7days  
    })

    console.log("Access token>>>>>> : ", accessToken);
    

    res.status(200).json({
        message:"access token refreshed successfully.",
        accessToken
    })
}
