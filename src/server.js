import express from "express";
import path from "path";
import globalRouter from "./router/globalRouter";
import "./db";
import "./models/Music";
import session from "express-session";

const app = express();

app.use(express.static(path.join(process.cwd(), "/public")));

app.set("view engine", "pug");
app.set("views", process.cwd() + "/src/views");
app.use(express.urlencoded({ extended: true })); //req.body 사용시 필요

app.use(
  session({
    secret: "lmg",
    resave: true,
    saveUninitialized: true,
  })
);

app.use((req, res, next) => {
  res.locals.loggedIn = Boolean(req.session.loggedIn);
  res.locals.user = req.session.user;
  next();
});

app.use("/", globalRouter);

export default app;
