import express from "express";
import path from "path";
import globalRouter from "./router/globalRouter";
import "./db";
import "./models/Music";

const PORT = 4000;
const app = express();

app.use(express.static(path.join(process.cwd(), "/public")));

app.set("view engine", "pug");
app.set("views", process.cwd() + "/src/views");
app.use(express.urlencoded({ extended: true })); //req.body 사용시 필요

app.use("/", globalRouter);

app.listen(PORT, () => {
  console.log(`Visit http://localhost:${PORT} 🎈`);
});
