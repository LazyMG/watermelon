import Music from "../models/Music";

export const home = async (req, res) => {
  const musics = await Music.find({});
  return res.render("home", { pageTitle: "Home", musics });
};

export const play = async (req, res) => {
  const musics = await Music.find({});
  return res.render("play", { pageTitle: "Play", musics });
};
