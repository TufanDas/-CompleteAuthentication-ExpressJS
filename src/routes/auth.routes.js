import { Router  } from "express";
import * as authControler from "../controlers/auth.controler.js";
const authRouter = Router()

// api/auth/register
authRouter.post("/register", authControler.register)

// api/auth/get-me
authRouter.get("/get-me", authControler.getMe)

export default authRouter

