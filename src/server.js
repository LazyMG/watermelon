import express from "express";

const PORT = 4000;
const app = express();

const musicArr = [
  { title: "First music", singer: "Anon", duration: "3.4" },
  { title: "Second music", singer: "Anon", duration: "3" },
  { title: "Thrid music", singer: "Anon", duration: "3.5" },
];

app.set("view engine", "pug");
app.set("views", process.cwd() + "/src/views");
app.get("/", (req, res) =>
  res.render("home", { pageTitle: "Home", musics: musicArr })
);

app.listen(PORT, () => {
  console.log(`Visit http://localhost:${PORT} 🎈`);
});
