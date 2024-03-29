import Music from "../models/Music";

// /search
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

// /upload
export const getUpload = (req, res) => {
  res.render("upload", { pageTitle: "Upload" });
};

export const postUpload = async (req, res) => {
  const { title, singer, albumTitle, coverImg } = req.body; //input의 name으로 찾음
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
  return res.redirect("/setting");
};

// /music/:id
export const musicDetail = async (req, res) => {
  const { id } = req.params;
  console.log(id);
  const music = await Music.findById(id);
  if (!music) return res.redirect("/");

  return res.render("detail", { pageTitle: `${music.title}`, music });
};

// /movie/:id/edit
export const getEdit = async (req, res) => {
  const { id } = req.params;
  const music = await Music.findById(id);
  if (!music) return res.redirect(`/music/${id}`);
  return res.render("edit", { pageTitle: "Edit", music });
};

export const postEdit = async (req, res) => {
  const { id } = req.params;
  const {
    title,
    singer,
    albumTitle,
    coverImg,
    titleEng,
    singerEng,
    albumTitleEng,
    ytId,
  } = req.body;
  await Music.findByIdAndUpdate(id, {
    title,
    singer,
    albumTitle,
    coverImg,
    titleEng,
    singerEng,
    albumTitleEng,
    ytId,
  });
  return res.redirect(`/music/${id}`);
};

// /movie/:id/delete
export const deleteMusic = async (req, res) => {
  const { id } = req.params;
  await Music.findByIdAndDelete(id);
  return res.redirect("/");
};
