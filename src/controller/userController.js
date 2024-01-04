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

  let admin;

  if (email === process.env.ADMIN_EMAIL) {
    admin = true;
  } else {
    admin = false;
  }

  await User.create({
    email,
    username,
    password,
    name,
    admin,
  });
  return res.redirect("/login");
};

// /login
export const getLogin = (req, res) => {
  return res.render("login", {
    pageTitle: "Login",
    googleId: process.env.GOOGLE_CLIENT_ID,
    googleRedirectionUrl: process.env.GOOGLE_REDIRECTION_URL,
  });
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

export const getGoogleLogin = (req, res) => {
  console.log("enter");
  return res.render("googleLogin");
};

export const postGoogleLogin = async (req, res) => {
  const { accessToken } = req.body;
  let info;
  try {
    info = await fetch("https://www.googleapis.com/oauth2/v2/userinfo", {
      method: "GET",
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json",
      },
    }).then((response) => {
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      return response.json();
    });
  } catch (error) {
    // 오류 처리
    console.error("Error fetching user info:", error);
    return res.render("login", { pageTitle: "Login", errorMessage: error });
  }
  const exists = await User.exists({ email: info.email + "/google" });
  let user;
  let admin;
  if (!exists) {
    if (info.email === process.env.ADMIN_EMAIL) {
      admin = true;
    } else {
      admin = false;
    }
    user = await User.create({
      email: info.email + "/google",
      username: info.name,
      password: "/google",
      name: info.name,
      admin,
    });
  } else {
    user = await User.findOne({
      email: info.email + "/google",
    });
  }
  req.session.loggedIn = true;
  req.session.user = user;
  return res.redirect("/main");
};

export const logout = (req, res) => {
  req.session.destroy();
  return res.redirect("/");
};
