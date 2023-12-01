import express from "express";
import { addPage, home, postAdd, search } from "../controller/globalController";

export const globalRouter = express.Router();

globalRouter.get("/", home);
globalRouter.get("/search", search);
globalRouter.get("/add", addPage);
globalRouter.post("/add", postAdd);

export default globalRouter;
