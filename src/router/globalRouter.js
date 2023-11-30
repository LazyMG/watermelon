import express from "express";
import { home, search } from "../controller/globalController";

export const globalRouter = express.Router();

globalRouter.get("/", home);
globalRouter.get("/search", search);

export default globalRouter;
