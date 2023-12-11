import Music from "../models/Music";

export const home = async (req, res) => {
  const musics = await Music.find({});
  console.log("Home", req.session);
  res.render("home", { pageTitle: "Home", musics });
};
