import express from "express";
import path from "path";

const PORT = 4000;
const app = express();

app.use(express.static(__dirname + "/client"));
app.get("/", (req, res) => {
  res.sendFile(__dirname + "/views/index.html");
});
app.get("/test", (req, res) => {
  res.sendFile(__dirname + "/views/test.html");
});
app.listen(PORT, () => {
  console.log(`Visit http://localhost:${PORT} 🎈`);
});
