import express from "express";
import { home } from "../controller/globalController";
import {
  getJoin,
  getLogin,
  postJoin,
  postLogin,
} from "../controller/userController";
import { getUpload, postUpload, search } from "../controller/musicController";

export const globalRouter = express.Router();

globalRouter.get("/", home);
globalRouter.get("/search", search);
globalRouter.route("/upload").get(getUpload).post(postUpload);
globalRouter.route("/join").get(getJoin).post(postJoin);
globalRouter.route("/login").get(getLogin).post(postLogin);

export default globalRouter;
