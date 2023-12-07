import "./db";
import "./models/Music";
import "./models/User";
import app from "./server";

const PORT = 4000;

app.listen(PORT, () => {
  console.log(`Visit http://localhost:${PORT} 🎈`);
});
