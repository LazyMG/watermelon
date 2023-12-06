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
} from "../controller/globalController";

export const globalRouter = express.Router();

globalRouter.get("/", home);
globalRouter.get("/search", search);
globalRouter.route("/upload").get(getUpload).post(postUpload);
globalRouter.get("/music/:id", musicDetail);
globalRouter.route("/music/:id/edit").get(getEdit).post(postEdit);
globalRouter.get("/music/:id/delete", deleteMusic);
export default globalRouter;
