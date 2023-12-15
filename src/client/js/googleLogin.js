const parsedHash = new URLSearchParams(window.location.hash.substring(1));
const accessToken = parsedHash.get("access_token");

fetch("/login-google", {
  method: "POST",
  headers: {
    "Content-Type": "application/json",
  },
  body: JSON.stringify({
    accessToken: accessToken,
  }),
})
  .then((response) => response.text())
  .then(() => (window.location.href = "/"))
  .catch((error) => {
    console.error("Error:", error);
  });
