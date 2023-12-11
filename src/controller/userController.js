import User from "../models/User";

// /join
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

// /login
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
  console.log(req.session);
  return res.redirect("/");
};

export const profile = async (req, res) => {
  console.log("proflie", req.session);
  const { id } = req.params;
  const user = await User.findById(id);
  return res.render("profile", { pageTitle: "Profile" });
};
