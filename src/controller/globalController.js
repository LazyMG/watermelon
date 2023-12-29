import Music from "../models/Music";

export const home = async (req, res) => {
  const musics = await Music.find({});
  return res.render("home", { pageTitle: "Home", musics });
};

export const play = async (req, res) => {
  const musics = await Music.find({});
  return res.render("play", { pageTitle: "Play", musics });
};

function splitArrayIntoChunks(arr, chunkSize) {
  const resultArray = [];
  for (let i = 0; i < arr.length; i += chunkSize) {
    resultArray.push(arr.slice(i, i + chunkSize));
  }
  return resultArray;
}

export const main = async (req, res) => {
  const allMusics = await Music.find({});
  const recentMusics = allMusics.sort(() => 0.5 - Math.random()).slice(0, 6);

  return res.render("main", {
    recentMusics,
    allMusics,
    googleId: process.env.GOOGLE_CLIENT_ID,
    googleRedirectionUrl: process.env.GOOGLE_REDIRECTION_URL,
    currentPage: "Home",
  });
};

export const profile = async (req, res) => {
  return res.render("profile", { currentPage: "Profile" });
  // const { id } = req.params;
  // if (id.endsWith("google")) {
  //   return res.render("profile", { currentPage: "Profile" });
  // }
  // const user = await User.findById(id);
  // return res.render("profile", { pageTitle: "Profile" });
};
