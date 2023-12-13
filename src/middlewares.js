export const localsMiddleware = (req, res, next) => {
  res.locals.loggedIn = Boolean(req.session.loggedIn);
  res.locals.user = req.session.user || {};
  next();
};

//로그인 안 한 사람은 들어올 수 없음
export const protectMiddleware = (req, res, next) => {
  if (req.session.loggedIn) {
    return next();
  } else {
    return res.redirect("/login");
  }
};

//로그인 한 사람은 들어올 수 없음
export const publicOnlyMiddleware = (req, res, next) => {
  if (!req.session.loggedIn) {
    return next();
  } else {
    return res.redirect("/");
  }
};

export const adminOnlyMiddleware = (req, res, next) => {
  if (!req.session.user.admin) {
    return res.redirect("/");
  } else {
    return next();
  }
};
