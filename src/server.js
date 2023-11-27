import express from "express";

const PORT = 4000;
const app = express();

app.set("view engine", "pug");
app.set("views", process.cwd() + "/src/views");
app.get("/", (req, res) => res.render("home", { pageTitle: "Home" }));

app.listen(PORT, () => {
  console.log(`Visit http://localhost:${PORT} 🎈`);
});
