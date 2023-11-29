import express from "express";
import getMusics from "./fakeDB";
import path from "path";

const PORT = 4000;
const app = express();

app.use(express.static(path.join(process.cwd(), "/public")));

app.set("view engine", "pug");
app.set("views", process.cwd() + "/src/views");
app.get("/", (req, res) =>
  res.render("home", { pageTitle: "Home", musics: getMusics() })
);
app.get("/search", (req, res) => {
  const { keyword } = req.query;
  const result = getMusics().filter(
    (music) =>
      music.singer.includes(keyword) || music.singerEng.includes(keyword)
  );
  res.render("search", { pageTitle: "Search", musics: result });
});

app.listen(PORT, () => {
  console.log(`Visit http://localhost:${PORT} 🎈`);
});
