import getMusics from "../fakeDB";
import Music from "../models/Music";
import User from "../models/User";

export const home = async (req, res) => {
  const musics = await Music.find({});
  //console.log(musics);
  res.render("home", { pageTitle: "Home", musics });
};

export const search = async (req, res) => {
  const { keyword, search } = req.query;
  let musics = [];
  if (keyword && search === "title") {
    musics = await Music.find({
      title: {
        $regex: new RegExp(keyword, "i"),
      },
    });
  } else if (keyword && search === "singer") {
    musics = await Music.find({
      singer: {
        $regex: new RegExp(keyword, "i"),
      },
    });
  } else {
    return res.render("search", { pageTitle: "Search" });
  }

  // const musics = getMusics().filter(
  //   (music) =>
  //     music.singer.includes(keyword) || music.singerEng.includes(keyword)
  // );
  //원하는 배열
  return res.render("search", { pageTitle: "Search", musics });
};

export const getUpload = (req, res) => {
  res.render("upload", { pageTitle: "Upload" });
};

export const postUpload = async (req, res) => {
  const { title, singer, albumTitle, coverImg } = req.body; //input의 name으로 찾음
  console.log(title, singer, albumTitle, coverImg);
  try {
    await Music.create({
      title,
      singer,
      albumTitle,
      coverImg,
    });
  } catch (error) {
    console.log(error);
    return res.render("upload", { pageTitle: "Upload", error });
  }
  return res.redirect("/");
};

export const musicDetail = async (req, res) => {
  const { id } = req.params;
  const music = await Music.findById(id);
  if (!music) return res.redirect("/");

  return res.render("detail", { pageTitle: `${music.title}`, music });
};

export const getEdit = async (req, res) => {
  const { id } = req.params;
  const music = await Music.findById(id);
  if (!music) return res.redirect(`/music/${id}`);
  return res.render("edit", { pageTitle: "Edit", music });
};

export const postEdit = async (req, res) => {
  const { id } = req.params;
  const { title, singer, albumTitle, coverImg } = req.body;
  await Music.findByIdAndUpdate(id, {
    title,
    singer,
    albumTitle,
    coverImg,
  });
  return res.redirect("/");
};

export const deleteMusic = async (req, res) => {
  const { id } = req.params;
  await Music.findByIdAndDelete(id);
  return res.redirect("/");
};

export const getJoin = (req, res) => {
  return res.render("join", { pageTitle: "Create Account" });
};

export const postJoin = async (req, res) => {
  const { email, username, password, name, passwordConfirm } = req.body;

  if (password !== passwordConfirm)
    return res.render("join", {
      pageTitle: "Join",
      errorMessage: "Incorrect Password",
    });

  // const usernameExists = await User.exists({ username });
  // if (usernameExists)
  //   return res.render("join", {
  //     pageTitle: "Create Account",
  //     errorMessage: "Already taken Username",
  //   });
  // const emailExists = await User.exists({ email });
  // if (emailExists)
  //   return res.render("join", {
  //     pageTitle: "Create Account",
  //     errorMessage: "Already taken Email",
  //   });

  //위 코드들을 하나로 묶음
  const exists = await User.exists({ $or: [{ username }, { email }] });
  if (exists)
    return res.render("join", {
      pageTitle: "Join",
      errorMessage: "Already taken Username / Email",
    });

  await User.create({
    email,
    username,
    password,
    name,
  });
  return res.redirect("/login");
};

export const getLogin = (req, res) => {
  return res.render("login", { pageTitle: "Login" });
};

export const postLogin = async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });
  if (!user)
    return res.render("login", { pageTitle: "Login", errorMessage: "No User" });
  if (password !== user.password)
    return res.render("login", {
      pageTitle: "Login",
      errorMessage: "Wrong Password",
    });
  req.session.loggedIn = true;
  req.session.user = user;

  return res.redirect("/");
};
