import express from "express";
import { home, main, play, profile } from "../controller/globalController";
import {
  getGoogleLogin,
  getJoin,
  getLogin,
  logout,
  postGoogleLogin,
  postJoin,
  postLogin,
} from "../controller/userController";
import { getUpload, postUpload, search } from "../controller/musicController";
import {
  adminOnlyMiddleware,
  protectMiddleware,
  publicOnlyMiddleware,
} from "../middlewares";

export const globalRouter = express.Router();

globalRouter.get("/", home);
globalRouter.get("/search", search);
globalRouter.get("/play", play);
globalRouter
  .route("/upload")
  .all(adminOnlyMiddleware)
  .get(getUpload)
  .post(postUpload);
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
globalRouter.route("/login-google").get(getGoogleLogin).post(postGoogleLogin);
globalRouter.get("/logout", protectMiddleware, logout);
globalRouter.get("/main", main);
globalRouter.get("/profile", profile);

export default globalRouter;
