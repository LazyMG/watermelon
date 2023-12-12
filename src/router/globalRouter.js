import express from "express";
import { home } from "../controller/globalController";
import {
  getGoogleLogin,
  getJoin,
  getLogin,
  postGoogleLogin,
  postJoin,
  postLogin,
} from "../controller/userController";
import { getUpload, postUpload, search } from "../controller/musicController";
import { publicOnlyMiddleware } from "../middlewares";

export const globalRouter = express.Router();

globalRouter.get("/", home);
globalRouter.get("/search", search);
globalRouter.route("/upload").get(getUpload).post(postUpload);
globalRouter
  .route("/join")
  .all(publicOnlyMiddleware)
  .get(getJoin)
  .post(postJoin);
globalRouter
  .route("/login")
  .all(publicOnlyMiddleware)
  .get(getLogin)
  .post(postLogin);
globalRouter
  .route("/login-google")
  .all(publicOnlyMiddleware)
  .get(getGoogleLogin)
  .post(postGoogleLogin);

export default globalRouter;
