import express from "express";
import { profile } from "../controller/userController";

export const userRouter = express.Router();

userRouter.get("/:id", profile);
