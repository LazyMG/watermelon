import express from "express";
import {
  musicDetail,
  getUpload,
  home,
  postUpload,
  search,
} from "../controller/globalController";

export const globalRouter = express.Router();

globalRouter.get("/", home);
globalRouter.get("/search", search);
globalRouter.route("/upload").get(getUpload).post(postUpload);
globalRouter.get("/music/:id", musicDetail);

export default globalRouter;
