import Music from "../models/Music";
import User from "../models/User";

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
  //playlistMusic 검색해서 가져오기
  let playListMusics = [];
  if (req.session.user) {
    const { _id: id } = req.session.user;
    playListMusics = await User.findById(id).populate("playList");
  }
  playListMusics = playListMusics.playList;
  return res.render("main", {
    recentMusics,
    allMusics,
    playListMusics,
    googleId: process.env.GOOGLE_CLIENT_ID,
    googleRedirectionUrl: process.env.GOOGLE_REDIRECTION_URL,
    currentPage: "Home",
  });
};

export const profile = async (req, res) => {
  return res.render("profile", {
    googleId: process.env.GOOGLE_CLIENT_ID,
    googleRedirectionUrl: process.env.GOOGLE_REDIRECTION_URL,
    currentPage: "Profile",
  });
  // const { id } = req.params;
  // if (id.endsWith("google")) {
  //   return res.render("profile", { currentPage: "Profile" });
  // }
  // const user = await User.findById(id);
  // return res.render("profile", { pageTitle: "Profile" });
};

export const addList = async (req, res) => {
  const { _id: id } = req.session.user;
  if (!id) return res.end();
  const ytId = req.body.addYtId;
  const addMusic = await Music.findOne({ ytId });
  const user = await User.findByIdAndUpdate(id, {
    $push: { playList: addMusic },
  });
  //console.log(user);
  return res.end();
};

export const removeList = async (req, res) => {
  console.log("delete");
  const { _id: id } = req.session.user;
  if (!id) return res.end();
  const ytId = req.body.deleteYtId;
  const removeMusic = await Music.findOne({ ytId });
  console.log(removeMusic._id);
  const user = await User.findByIdAndUpdate(id, {
    $pull: { playList: removeMusic._id },
  });
  //console.log(user);
  return res.end();
};
