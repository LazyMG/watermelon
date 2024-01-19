import Music from "../models/Music";
import User from "../models/User";

export const setting = async (req, res) => {
  const musics = await Music.find({});
  return res.render("setting", { pageTitle: "Setting", musics });
};

export const play = async (req, res) => {
  const musics = await Music.find({});
  return res.render("play", { pageTitle: "Play", musics });
};

export const home = async (req, res) => {
  const allMusics = await Music.find({});
  const recentMusics = allMusics.sort(() => 0.5 - Math.random()).slice(0, 6);
  const recommendMusics = allMusics
    .sort(() => 0.5 - Math.random())
    .slice(0, 12);
  let playListMusics = [];
  if (req.session.user) {
    const { _id: id } = req.session.user;
    playListMusics = await User.findById(id).populate("playList");
  }
  playListMusics = playListMusics.playList;
  return res.render("main", {
    recentMusics,
    recommendMusics,
    playListMusics,
    googleId: process.env.GOOGLE_CLIENT_ID,
    googleRedirectionUrl: process.env.GOOGLE_REDIRECTION_URL,
    currentPage: "Home",
  });
};

export const profile = async (req, res) => {
  let playListMusics = [];
  if (req.session.user) {
    const { _id: id } = req.session.user;
    playListMusics = await User.findById(id).populate("playList");
  }
  playListMusics = playListMusics.playList;
  return res.render("profile", {
    googleId: process.env.GOOGLE_CLIENT_ID,
    googleRedirectionUrl: process.env.GOOGLE_REDIRECTION_URL,
    currentPage: "Profile",
    playListMusics,
  });
  // const { id } = req.params;
  // if (id.endsWith("google")) {
  //   return res.render("profile", { currentPage: "Profile" });
  // }
  // const user = await User.findById(id);
  // return res.render("profile", { pageTitle: "Profile" });
};

export const edit = async (req, res) => {
  if (!req.session.user) return res.end();
  const { _id: id } = req.session.user;
  if (!id) return res.end();
  const username = req.body.username;
  const user = await User.findByIdAndUpdate(
    id,
    {
      username,
    },
    { new: true }
  );
  req.session.user = user;
  return res.end();
};

export const addList = async (req, res) => {
  if (!req.session.user) return res.end();
  const { _id: id } = req.session.user;
  if (!id) return res.end();
  const ytId = req.body.addYtId;
  const addMusic = await Music.findOne({ ytId });
  await User.findByIdAndUpdate(id, {
    $push: { playList: addMusic },
  });
  return res.end();
};

export const removeList = async (req, res) => {
  if (!req.session.user) return res.end();
  const { _id: id } = req.session.user;
  if (!id) return res.end();
  const ytId = req.body.deleteYtId;
  const removeMusic = await Music.findOne({ ytId });
  await User.findByIdAndUpdate(id, {
    $pull: { playList: removeMusic._id },
  });
  return res.end();
};

export const getSearchMusic = async (req, res) => {
  const { search } = req.query;
  //search로 검색
  const keyword = search.toLowerCase();
  const searchedMusics = await Music.find({
    $or: [
      { title: { $regex: new RegExp(keyword, "i") } },
      { titleEng: { $regex: new RegExp(keyword, "i") } },
      { singer: { $regex: new RegExp(keyword, "i") } },
      { singerEng: { $regex: new RegExp(keyword, "i") } },
      { albumTitle: { $regex: new RegExp(keyword, "i") } },
      { albumTitleEng: { $regex: new RegExp(keyword, "i") } },
    ],
  });
  let playListMusics = [];
  if (req.session.user) {
    const { _id: id } = req.session.user;
    playListMusics = await User.findById(id).populate("playList");
  }
  playListMusics = playListMusics.playList;
  return res.render("main", {
    currentPage: "Search",
    googleId: process.env.GOOGLE_CLIENT_ID,
    googleRedirectionUrl: process.env.GOOGLE_REDIRECTION_URL,
    searchedMusics,
    playListMusics,
    length: searchedMusics.length,
  });
};
