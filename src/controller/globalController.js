import getMusics from "../fakeDB";

export const home = (req, res) =>
  res.render("home", { pageTitle: "Home", musics: getMusics() });

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

export const addPage = (req, res) => {
  res.render("addPage", { pageTitle: "Add" });
};

export const postAdd = (req, res) => {
  const { title, singer } = req.body; //input의 name으로 찾음
  res.redirect("/");
};
