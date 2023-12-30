const playContainer = document.getElementById("player__container");
const playControl = document.getElementById("player__control");
const playBar = document.getElementById("play-bar");

const musicComponent = document.querySelectorAll(".music");
const musicComponentArray = [...musicComponent];

const playBtn = document.querySelector(".player__control__play");
const muteBtn = document.getElementById("muteBtn");
const addBtn = document.getElementById("addBtn");
const currentTime = document.getElementById("currentTime");
const totalTime = document.getElementById("totalTime");
const durationRange = document.getElementById("duration");

const loginDiv = document.querySelector(".main__container__login");

let isMute = false;
let loading = false;
let ytId = "";

const createPlayBarContent = (dataset) => {
  if (document.querySelector(".player__music")) {
    document.querySelector(".player__music").remove();
  }
  const playerMusic = document.createElement("div");
  playerMusic.classList.add("player__music");
  playerMusic.dataset.ytid = dataset.ytid;

  // 자식 요소들 생성
  const musicImg = document.createElement("img");
  musicImg.classList.add("player__music__img");
  musicImg.src = dataset.coverimg;

  const musicInfo = document.createElement("div");
  musicInfo.classList.add("player__music__info");

  const musicTitle = document.createElement("div");
  musicTitle.classList.add("player__music__title");
  const titleSpan = document.createElement("span");
  titleSpan.textContent = dataset.title;
  musicTitle.appendChild(titleSpan);

  const musicSinger = document.createElement("div");
  musicSinger.classList.add("player__music__singer");
  const singerSpan = document.createElement("span");
  singerSpan.textContent = dataset.singer;
  musicSinger.appendChild(singerSpan);

  // 각 요소들을 연결
  musicInfo.appendChild(musicTitle);
  musicInfo.appendChild(musicSinger);

  playerMusic.appendChild(musicImg);
  playerMusic.appendChild(musicInfo);

  playControl.parentNode.insertBefore(playerMusic, playControl.nextSibling);
};

musicComponentArray.forEach((element) => {
  element.addEventListener("click", () => {
    durationRange.value = "0";
    if (!loading) {
      const newId = element.dataset.ytid;
      createPlayBarContent(element.dataset);
      playLogic();
      loading = true;
      updatePlayerWithNewId(newId);
      playBar.classList.remove("hide");
      playBar.classList.add("show");
    }
  });
});

const handleMute = () => {
  // if (player.isMuted() && volumeValue !== "0") {
  //   player.unMute();
  //   player.setVolume(volumeValue);
  //   volumeRange.value = volumeValue;
  //   muteBtn.classList.add("fa-volume-up");
  //   muteBtn.classList.remove("fa-volume-mute");
  //   isMute = false;
  // } else {
  //   volumeValue = volumeRange.value;
  //   volumeRange.value = 0;
  //   player.mute();
  //   muteBtn.classList.remove("fa-volume-up");
  //   muteBtn.classList.add("fa-volume-mute");
  //   isMute = true;
  // }
  if (muteBtn.classList.contains("fa-volume-up")) {
    muteBtn.classList.remove("fa-volume-up");
    muteBtn.classList.add("fa-volume-mute");
  } else {
    muteBtn.classList.add("fa-volume-up");
    muteBtn.classList.remove("fa-volume-mute");
  }
};
muteBtn.addEventListener("click", handleMute);

const handleAdd = () => {
  //fetch
  const playerMusic = document.querySelector(".player__music");
  if (!playerMusic) return;
  const addYtId = playerMusic.dataset.ytid;
  const addCoverImg = playerMusic.querySelector("img").src;
  const addTitle = playerMusic
    .querySelector(".player__music__title")
    .querySelector("span").innerText;
  const addSinger = playerMusic
    .querySelector(".player__music__singer")
    .querySelector("span").innerText;
  const data = {
    addYtId,
    addCoverImg,
    addTitle,
    addSinger,
  };
  createSidebarPlayListItem(data);
  //1. ytid를 보냄 2. 서버에서 ytid를 검색해서 음악을 찾음 3. 찾은 음악을 리스트에 추가
};
const handleDelete = (event) => {
  //fetch
  const deleteYtId = event.target.parentNode.dataset.ytid;
  event.target.parentNode.parentNode.remove();
};
const createSidebarPlayListItem = (data) => {
  // .sidebar__playlist-item 요소 생성
  const playlistItem = document.createElement("div");
  playlistItem.classList.add("sidebar__playlist-item", "music");
  playlistItem.id = "playlist-item";
  playlistItem.dataset.ytid = data.addYtId;

  // .sidebar__playlist-img 요소 생성 및 추가
  const playlistImg = document.createElement("img");
  playlistImg.classList.add("sidebar__playlist-img");
  playlistImg.src = data.addCoverImg;
  playlistItem.appendChild(playlistImg);

  const playlistItemContainer = document.createElement("div");
  playlistItemContainer.classList.add("sidebar__playlist-item-container");

  // .sidebar__playlist-info 요소 생성 및 추가
  const playlistInfo = document.createElement("div");
  playlistInfo.classList.add("sidebar__playlist-info");
  playlistItemContainer.appendChild(playlistInfo);

  // .sidebar__playlist-title 요소 생성 및 추가
  const playlistTitle = document.createElement("span");
  playlistTitle.classList.add("sidebar__playlist-title");
  playlistTitle.textContent = data.addTitle;
  playlistInfo.appendChild(playlistTitle);

  // .sidebar__playlist-singer 요소 생성 및 추가
  const playlistSinger = document.createElement("span");
  playlistSinger.classList.add("sidebar__playlist-singer");
  playlistSinger.textContent = data.addSinger;
  playlistInfo.appendChild(playlistSinger);

  // .sidebar__playlist-remove 요소 생성 및 추가
  const playlistRemove = document.createElement("div");
  playlistRemove.classList.add("sidebar__playlist-remove", "fas", "fa-minus");
  playlistRemove.id = "remove";
  playlistItemContainer.appendChild(playlistRemove);

  playlistItem.appendChild(playlistItemContainer);

  playlistRemove.addEventListener("click", handleDelete);

  // .sidebar__playlist에 생성한 요소 추가
  const sidebarPlaylist = document.querySelector(".sidebar__playlist");
  sidebarPlaylist.appendChild(playlistItem);
};
addBtn.addEventListener("click", handleAdd);

const tag = document.createElement("script");

tag.src = "https://www.youtube.com/iframe_api";
const firstScriptTag = document.getElementsByTagName("script")[0];
firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);

let player;
function onYouTubeIframeAPIReady() {
  player = new YT.Player("player", {
    height: "0",
    width: "0",
    videoId: ytId,
    events: {
      onReady: onPlayerReady,
      onStateChange: onPlayerStateChange,
    },
  });
}

function updateCurrentTime() {
  if (player && typeof player.getCurrentTime === "function") {
    const currentTimeFormatted = new Date(player.getCurrentTime() * 1000)
      .toISOString()
      .substring(14, 19);
    currentTime.innerText = currentTimeFormatted;
  }
  requestAnimationFrame(updateCurrentTime);
}

function updatePlayerWithNewId(newYtId) {
  if (player) {
    player.stopVideo();
    player.destroy();
  }

  ytId = newYtId;

  player = new YT.Player("player", {
    height: "0",
    width: "0",
    videoId: ytId,
    events: {
      onReady: onPlayerReady,
      onStateChange: onPlayerStateChange,
    },
  });
}

function onPlayerReady(event) {
  event.target.playVideo();
  //event.target.setVolume(volumeValue);
  if (isMute) {
    event.target.mute();
  } else {
    event.target.unMute();
  }
  if (event.target.videoTitle) {
    const formatedTime = new Date(event.target.getDuration() * 1000)
      .toISOString()
      .substring(14, 19);
    totalTime.innerText = formatedTime;
    durationRange.max = Math.floor(event.target.getDuration());
  }
  requestAnimationFrame(updateCurrentTime);
  loading = false;
}

let intervalId;
function onPlayerStateChange(event) {
  if (event.data == YT.PlayerState.PLAYING) {
    clearInterval(intervalId);

    intervalId = setInterval(() => {
      const playerCurrentTime = event.target.getCurrentTime();

      //console.log("Current Time:", Math.round(playerCurrentTime));
      durationRange.value = playerCurrentTime;
    }, 1000);
    //event.target.setVolume(volumeValue);
  } else {
    clearInterval(intervalId);
  }
}

function stopVideo() {
  player.stopVideo();
}
const playLogic = () => {
  playBtn.classList.remove("fa-play");
  playBtn.classList.add("fa-pause");
};
const pauseLogic = () => {
  playBtn.classList.remove("fa-play");
  playBtn.classList.add("fa-play");
};
playBtn.addEventListener("click", () => {
  if (ytId === "") return;
  if (playBtn.classList.contains("fa-play")) {
    playLogic();
    player.playVideo();
  } else {
    pauseLogic();
    player.pauseVideo();
  }
});
// stopBtn.addEventListener("click", () => {
//   player.stopVideo();
//   pauseLogic();
//   currentTime.innerText = "00:00";
//   totalTime.innerText = "00:00";
//   durationRange.value = 0;
// });
durationRange.addEventListener("change", (event) => {
  const {
    target: { value },
  } = event;
  if (player.videoTitle) {
    player.seekTo(value, true);
  } else {
    event.target.value = 0;
    return;
  }
});
durationRange.addEventListener("input", (event) => {
  const {
    target: { value },
  } = event;
  const formattedTime = new Date(value * 1000).toISOString().substring(14, 19);
  console.log(formattedTime);
});
