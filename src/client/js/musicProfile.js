const editForm = document.querySelector(".profile-loggedIn__form");
const editInput = document.querySelector(".profile-loggedIn__form-text");
editForm.addEventListener("submit", (event) => {
  event.preventDefault();
  const username = editInput.value;
  //fetch
  fetch("/edit", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ username }),
  });
});

const musicContainer = document.querySelector(".profile-music-container");

const musics = document.querySelectorAll(".music");
if (musics.length !== 0) {
  musics.forEach((music) => {
    music.addEventListener("click", () => {
      if (document.querySelector(".profile-music-container__content")) {
        document.querySelector(".profile-music-container__content").remove();
      }
      const contentElement = document.createElement("div");
      contentElement.className = "profile-music-container__content";
      const ytId = music.dataset.ytid;
      const imgElement = document.createElement("img");
      imgElement.className = "profile-music-container__img";
      imgElement.classList.add("url");
      imgElement.src = music.dataset.coverimg;

      const titleElement = document.createElement("div");
      titleElement.className = "profile-music-container__title";
      titleElement.textContent = music.dataset.title;

      const singerElement = document.createElement("div");
      singerElement.className = "profile-music-container__singer";
      singerElement.textContent =
        music.dataset.singer + " | " + music.dataset.album;

      // 각각의 하위 요소를 부모 요소에 추가
      contentElement.appendChild(imgElement);
      contentElement.appendChild(titleElement);
      contentElement.appendChild(singerElement);

      // 부모 컨테이너에 생성된 요소를 추가
      musicContainer.appendChild(contentElement);

      const youtubeUrl = document.querySelector(".url");
      if (youtubeUrl) {
        youtubeUrl.addEventListener("click", () => {
          window.location = `https://www.youtube.com/watch?v=${ytId}`;
        });
      }
    });
  });
}

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
