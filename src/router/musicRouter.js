import express from "express";
import {
  deleteMusic,
  getEdit,
  musicDetail,
  postEdit,
} from "../controller/musicController";
import { adminOnlyMiddleware } from "../middlewares";

export const musicRouter = express.Router();

musicRouter.get("/music/:id", musicDetail);
musicRouter
  .route("/music/:id/edit")
  .all(adminOnlyMiddleware)
  .get(getEdit)
  .post(postEdit);
musicRouter.get("/music/:id/delete", adminOnlyMiddleware, deleteMusic);
