import express from "express";
import { profile } from "../controller/userController";
import { protectMiddleware } from "../middlewares";

export const userRouter = express.Router();

userRouter.get("/:id", protectMiddleware, profile);
