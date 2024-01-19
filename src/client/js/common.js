const selectedLink = document.querySelector(".selected");

if (selectedLink) {
  selectedLink.addEventListener("click", function (event) {
    event.preventDefault();
  });
}
