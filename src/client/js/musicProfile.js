const initialPlayListItem = document.querySelectorAll("#playlist-item");
let playListMusics = [...initialPlayListItem];

const handleDelete = (event) => {
  event.stopPropagation();
  const deleteYtId = event.target.parentNode.parentNode.dataset.ytid;
  playListMusics.pop(event.target.parentNode.parentNode);
  event.target.parentNode.parentNode.remove();
  fetch("/api/removeList", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ deleteYtId }),
  });
};

const deleteBtnComponent = document.querySelectorAll("#remove");
if (deleteBtnComponent) {
  const deleteBtnComponentArray = [...deleteBtnComponent];
  deleteBtnComponentArray.forEach((element) => {
    element.addEventListener("click", handleDelete);
  });
}
