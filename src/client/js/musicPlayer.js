const playContainer = document.getElementById("player__container");
const playControl = document.getElementById("player__control");
const playBar = document.getElementById("play-bar");

const musicComponent = document.querySelectorAll(".music");
const musicComponentArray = [...musicComponent];

const playBtn = document.querySelector(".player__control__play");
const muteBtn = document.getElementById("muteBtn");
const repeatBtn = document.getElementById("repeatBtn");
const addBtn = document.getElementById("addBtn");
const backwardBtn = document.getElementById("backwardBtn");
const forwardBtn = document.getElementById("forwardBtn");

const currentTime = document.getElementById("currentTime");
const totalTime = document.getElementById("totalTime");
const durationRange = document.getElementById("duration");
const volumeRange = document.getElementById("volume");

let isMute = false;
let loading = false;
let ytId = "";
let volumeValue = volumeRange.value;
let isEnd = false;
let isRepeat = false;
let musicNumber = -1;

const initialPlayListItem = document.querySelectorAll("#playlist-item");
let playListMusics = [...initialPlayListItem];
console.log(playListMusics);

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
      ytId = newId;
      createPlayBarContent(element.dataset);
      playLogic();
      loading = true;
      updatePlayerWithNewId(ytId);
    }
  });
});

const handleMute = () => {
  if (player.isMuted() && volumeValue !== "0") {
    player.unMute();
    player.setVolume(volumeValue);
    volumeRange.value = volumeValue;
    muteBtn.classList.add("fa-volume-up");
    muteBtn.classList.remove("fa-volume-mute");
    isMute = false;
  } else {
    volumeValue = volumeRange.value;
    volumeRange.value = 0;
    player.mute();
    muteBtn.classList.remove("fa-volume-up");
    muteBtn.classList.add("fa-volume-mute");
    isMute = true;
  }
};
muteBtn.addEventListener("click", handleMute);

const handleVolumeVisivle = () => {
  volumeRange.classList.remove("hide");
  volumeRange.classList.add("show");
};
muteBtn.addEventListener("mouseenter", handleVolumeVisivle);

const handleVolumeInvisible = () => {
  volumeRange.classList.remove("show");
  volumeRange.classList.add("hide");
};
playBar.addEventListener("mouseleave", handleVolumeInvisible);

const handleVolume = (event) => {
  volumeValue = event.target.value;
  player.setVolume(volumeValue);
  if (event.target.value === "0") {
    muteBtn.classList.remove("fa-volume-up");
    muteBtn.classList.add("fa-volume-mute");
  } else {
    muteBtn.classList.add("fa-volume-up");
    muteBtn.classList.remove("fa-volume-mute");
  }
};
volumeRange.addEventListener("input", handleVolume);

const handleAdd = () => {
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
  let validateFlag = false;
  playListMusics.forEach((music) => {
    if (music.dataset.ytid === addYtId) {
      validateFlag = true;
      return;
    }
  });
  if (validateFlag) {
    return;
  }
  createSidebarPlayListItem(data);

  fetch("/api/addList", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ addYtId }),
  });
};
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
  playListMusics.push(playlistItem);

  playlistRemove.addEventListener("click", handleDelete);
  playlistItem.addEventListener("click", () => {
    durationRange.value = "0";
    if (!loading) {
      const newId = data.ytid;
      ytId = newId;
      createPlayBarContent(data);
      playLogic();
      loading = true;
      updatePlayerWithNewId(ytId);
    }
  });

  // .sidebar__playlist에 생성한 요소 추가
  const sidebarPlaylist = document.querySelector(".sidebar__playlist");
  sidebarPlaylist.appendChild(playlistItem);
};
addBtn.addEventListener("click", handleAdd);

const deleteBtnComponent = document.querySelectorAll("#remove");
if (deleteBtnComponent) {
  const deleteBtnComponentArray = [...deleteBtnComponent];
  deleteBtnComponentArray.forEach((element) => {
    element.addEventListener("click", handleDelete);
  });
}

const tag = document.createElement("script");

tag.src = "https://www.youtube.com/iframe_api";
const firstScriptTag = document.getElementsByTagName("script")[0];
firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);

let player;
let playerReady = false;
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
  playerReady = true;
}

function updateCurrentTime() {
  if (player && typeof player.getCurrentTime === "function") {
    const currentTimeFormatted = new Date(player.getCurrentTime() * 1000)
      .toISOString()
      .substring(14, 19);
    if (!isEnd) currentTime.innerText = currentTimeFormatted;
  }
  requestAnimationFrame(updateCurrentTime);
}

function updatePlayerWithNewId(newYtId) {
  if (
    typeof player.stopVideo !== "function" ||
    typeof player.destroy !== "function"
  ) {
    return;
  }
  player.stopVideo();
  player.destroy();

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

  playBar.classList.remove("hide");
  playBar.classList.add("show");
  isEnd = false;
}

function onPlayerReady(event) {
  event.target.playVideo();
  event.target.setVolume(volumeValue);
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
      if (!loading) {
        durationRange.value = playerCurrentTime;
      }
      //console.log("Interval", durationRange.value);
    }, 1000);
    event.target.setVolume(volumeValue);
  } else {
    clearInterval(intervalId);
  }
  if (event.data == YT.PlayerState.ENDED) {
    durationRange.value = event.target.getDuration();
    currentTime.innerText = totalTime.innerText;
    if (isRepeat) {
      updatePlayerWithNewId(ytId);
      return;
    }
    setMusicNumber();
    //리스트의 곡이 아니거나 리스트의 마지막 곡일 때
    if (musicNumber === -1 || playListMusics.length === musicNumber + 1) {
      playBtn.classList.add("fa-play");
      playBtn.classList.remove("fa-pause");
      isEnd = true;
      return;
    }
    //리스트의 다음곡 재생
    handleForward();
  }
}

function stopVideo() {
  player.stopVideo();
}
const playLogic = () => {
  playBtn.classList.remove("fa-play");
  playBtn.classList.add("fa-pause");
  if (isEnd) {
    updatePlayerWithNewId(ytId);
    isEnd = false;
  }
};
const pauseLogic = () => {
  playBtn.classList.remove("fa-play");
  playBtn.classList.add("fa-play");
};
playBtn.addEventListener("click", () => {
  if (ytId === "") return;
  if (playBtn.classList.contains("fa-play")) {
    playLogic();
    if (player && typeof player.playVideo === "function") player.playVideo();
  } else {
    pauseLogic();
    player.pauseVideo();
  }
});

durationRange.addEventListener("change", (event) => {
  const {
    target: { value },
  } = event;
  if (player.videoTitle) {
    player.seekTo(value, true);
    isEnd = false;
    if (playBtn.classList.contains("fa-play")) {
      playLogic();
    }
  } else {
    event.target.value = 0;
    return;
  }
});

const handleRepeat = (event) => {
  if (!isRepeat) {
    isRepeat = true;
    event.target.style.opacity = "1";
  } else {
    isRepeat = false;
    event.target.style.opacity = "0.3";
  }
};
repeatBtn.addEventListener("click", handleRepeat);

const setMusicNumber = () => {
  playListMusics.forEach((music, index) => {
    if (music.dataset.ytid === ytId) {
      musicNumber = index;
    }
  });
};

const handleForward = () => {
  //리스트에 노래가 없을 때
  if (playListMusics.length === 0) {
    return;
  }
  setMusicNumber();
  //지금 재생곡이 리스트에 없어서 다음 곡 재생할 수 없을 때
  if (musicNumber === -1) {
    return;
  }
  if (playListMusics[musicNumber + 1]) {
    //다음 곡이 존재할 때
    console.log("next");
    console.log(playListMusics[musicNumber + 1]);
    const nextMusic = playListMusics[musicNumber + 1];
    createPlayBarContent(nextMusic.dataset);
    updatePlayerWithNewId(nextMusic.dataset.ytid);
  } else {
    //현재 곡이 마지막 곡일 때
    console.log("last");
  }
};
forwardBtn.addEventListener("click", handleForward);

const handleBackward = () => {
  if (playListMusics.length === 0) {
    return;
  }
  setMusicNumber();

  if (musicNumber === -1) {
    return;
  }

  if (playListMusics[musicNumber - 1]) {
    //이전 곡이 존재할 때
    console.log("prev");
    console.log(playListMusics[musicNumber - 1]);
    const prevMusic = playListMusics[musicNumber - 1];
    createPlayBarContent(prevMusic.dataset);
    updatePlayerWithNewId(prevMusic.dataset.ytid);
  } else {
    //현재 곡이 첫곡일 때
    console.log("first");
  }
};
backwardBtn.addEventListener("click", handleBackward);
