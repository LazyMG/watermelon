import mongoose from "mongoose";

const musicSchema = new mongoose.Schema({
  title: String,
  titleEng: String,
  singer: String,
  singerEng: String,
  albumTitle: String,
  createdAt: Date,
  coverImg: String,
  meta: {
    views: Number,
    rating: Number,
  },
});

const Music = mongoose.model("Music", musicSchema);
export default Music;
