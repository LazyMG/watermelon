const playContainer = document.getElementById("player__container");
const playControl = document.getElementById("player__control");
const playBar = document.getElementById("play-bar");

const musicComponent = document.querySelectorAll(".music");
const musicComponentArray = [...musicComponent];

const playBtn = document.querySelector(".player__control__play");
const currentTime = document.getElementById("currentTime");
const totalTime = document.getElementById("totalTime");
const durationRange = document.getElementById("duration");

let isMute = false;
let loading = false;
let ytId = "";

const createPlayBarContent = (dataset) => {
  if (document.querySelector(".player__music")) {
    document.querySelector(".player__music").remove();
  }
  const playerMusic = document.createElement("div");
  playerMusic.classList.add("player__music");

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
    }
  });
});

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
  playBtn.classList.remove("play");
  playBtn.classList.add("pause");
  //playBtn.textContent = "Pause";
};
const pauseLogic = () => {
  playBtn.classList.remove("pause");
  playBtn.classList.add("play");
  //playBtn.textContent = "Play";
};
playBtn.addEventListener("click", () => {
  if (ytId === "") return;
  if (playBtn.classList.contains("play")) {
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
