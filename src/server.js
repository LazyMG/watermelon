import express from "express";
import path from "path";
import globalRouter from "./router/globalRouter";
import session from "express-session";
import MongoStore from "connect-mongo";
import "./db";
import "./models/Music";
import { musicRouter } from "./router/musicRouter";
import { userRouter } from "./router/userRouter";
import { localsMiddleware } from "./middlewares";

const app = express();

app.use(express.static(path.join(process.cwd(), "/src/client/js")));
app.use("/static", express.static("assets"));
app.set("view engine", "pug");
app.set("views", process.cwd() + "/src/views");
app.use(express.urlencoded({ extended: true })); //req.body 사용시 필요
app.use(express.json());

app.use(
  session({
    secret: process.env.COOKIE_SECRET,
    resave: false,
    saveUninitialized: false,
    store: MongoStore.create({
      mongoUrl: process.env.DB_URL,
    }),
  })
);

app.use(localsMiddleware);

app.use("/", globalRouter);
app.use("/music", musicRouter);
app.use("/user", userRouter);

export default app;
