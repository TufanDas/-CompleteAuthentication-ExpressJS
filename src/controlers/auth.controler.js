import userModel from "../models/user.model.js"
import crypto from "crypto"
import jwt from "jsonwebtoken"
import config from "../config/config.js"


export async function register(req, res){

    const {username, email, password} = req.body

    const isAlreadyRegister = await userModel.findOne({
        $or:[{username}, {email}]
    })

    if(isAlreadyRegister){
        res.status(409).json({
            msg:"username already exixts.."
        })
    }

    const hashedPassword = crypto.createHash("sha256").update(password).digest("hex");
    const user = await userModel.create({
        username,
        email,
        password:hashedPassword
    })

    const token = jwt.sign({
        id:user._id
    }, config.JWT_SECRET,
       {expiresIn:"1d"}
    )

    res.status(201).json({
        msg:"user registered suuccessfully..",
        user:{
            username: user.username,
            email:user.email,
        },
        token
    })

}