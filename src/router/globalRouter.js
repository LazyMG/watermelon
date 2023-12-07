import express from "express";
import {
  musicDetail,
  getUpload,
  home,
  postUpload,
  search,
  getEdit,
  postEdit,
  deleteMusic,
  getJoin,
  postJoin,
  getLogin,
  postLogin,
} from "../controller/globalController";

export const globalRouter = express.Router();

globalRouter.get("/", home);
globalRouter.get("/search", search);
globalRouter.route("/upload").get(getUpload).post(postUpload);
globalRouter.get("/music/:id", musicDetail);
globalRouter.route("/music/:id/edit").get(getEdit).post(postEdit);
globalRouter.get("/music/:id/delete", deleteMusic);
globalRouter.route("/join").get(getJoin).post(postJoin);
globalRouter.route("/login").get(getLogin).post(postLogin);
export default globalRouter;
