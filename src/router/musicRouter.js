import express from "express";
import {
  deleteMusic,
  getEdit,
  musicDetail,
  postEdit,
} from "../controller/musicController";

export const musicRouter = express.Router();

musicRouter.get("/music/:id", musicDetail);
musicRouter.route("/music/:id/edit").get(getEdit).post(postEdit);
musicRouter.get("/music/:id/delete", deleteMusic);
