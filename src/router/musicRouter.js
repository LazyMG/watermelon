import express from "express";
import {
  deleteMusic,
  getEdit,
  musicDetail,
  postEdit,
} from "../controller/musicController";
import { adminOnlyMiddleware } from "../middlewares";

export const musicRouter = express.Router();

musicRouter.get("/:id", musicDetail);
musicRouter
  .route("/:id/edit")
  .all(adminOnlyMiddleware)
  .get(getEdit)
  .post(postEdit);
musicRouter.get("/:id/delete", adminOnlyMiddleware, deleteMusic);
