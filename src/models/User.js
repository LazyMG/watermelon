import mongoose from "mongoose";
import Music from "./Music";

const userSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  name: { type: String, required: true },
  admin: { type: Boolean, required: true },
  playList: [
    {
      title: { type: String, require: true },
      titleEng: { type: String, default: "" },
      singer: { type: String, require: true },
      singerEng: { type: String, default: "" },
      albumTitle: { type: String, require: true },
      albumTitleEng: { type: String, default: "" },
      createdAt: { type: Date, default: Date.now },
      coverImg: String,
      ytId: { type: String, default: "" },
    },
  ],
});

const User = mongoose.model("User", userSchema);
export default User;
