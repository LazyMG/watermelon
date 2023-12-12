const URL =
  "https://accounts.google.com/o/oauth2/auth?" +
  `client_id=${process.env.GOOGLE_CLIENT_ID}&` +
  `redirect_uri=${process.env.GOOGLE_REDIRECTION_URL}&` +
  "response_type=token&" +
  "scope=https://www.googleapis.com/auth/userinfo.email https://www.googleapis.com/auth/userinfo.profile";

const googleBtn = document.getElementById("google");

googleBtn.addEventListener("click", () => {
  window.location.href = URL;
});
