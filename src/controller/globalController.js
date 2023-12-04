import getMusics from "../fakeDB";
import Music from "../models/Music";

export const home = async (req, res) => {
  const musics = await Music.find({});
  //console.log(musics);
  res.render("home", { pageTitle: "Home", musics });
};

export const search = (req, res) => {
  const { keyword } = req.query;
  const musics = getMusics().filter(
    (music) =>
      music.singer.includes(keyword) || music.singerEng.includes(keyword)
  );
  //원하는 배열
  //검색할 때 가수나 제목으로 찾기
  res.render("search", { pageTitle: "Search", musics });
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
