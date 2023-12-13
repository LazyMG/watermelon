import Music from "../models/Music";

export const home = async (req, res) => {
  const musics = await Music.find({});
  res.render("home", { pageTitle: "Home", musics });
};
