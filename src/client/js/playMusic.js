const tag = document.createElement("script");
const playBtn = document.getElementById("playBtn");
const stopBtn = document.getElementById("stopBtn");
const muteBtn = document.getElementById("muteBtn");
const volumeRange = document.getElementById("volume");
const currentTime = document.getElementById("currentTime");
const totalTime = document.getElementById("totalTime");
const durationRange = document.getElementById("duration");

const musicContainer = document.querySelectorAll(".musicContainer");
const musicContainerArray = [...musicContainer];

let ytId = "";
let volumeValue = volumeRange.value;
let isMute = false;
let loading = false;

musicContainerArray.forEach((element) => {
  element.querySelector("#musicTitle").addEventListener("click", () => {
    if (!loading) {
      const newId = element.dataset.ytid;
      playLogic();
      loading = true;
      updatePlayerWithNewId(newId);
    }
    console.log(player);
  });
});

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

const handleVolume = () => {
  volumeValue = volumeRange.value;
  player.setVolume(volumeValue);
  if (volumeValue === "0") {
    muteBtn.innerText = "Unmute";
    isMute = true;
  } else {
    player.unMute();
    muteBtn.innerText = "Mute";
    isMute = false;
  }
};
volumeRange.addEventListener("input", handleVolume);

const handleMute = () => {
  if (player.isMuted() && volumeValue !== "0") {
    player.unMute();
    player.setVolume(volumeValue);
    volumeRange.value = volumeValue;
    muteBtn.innerText = "Mute";
    isMute = false;
  } else {
    volumeValue = volumeRange.value;
    volumeRange.value = 0;
    player.mute();
    muteBtn.innerText = "Unmute";
    isMute = true;
  }
};
muteBtn.addEventListener("click", handleMute);

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

      //console.log("Current Time:", Math.round(playerCurrentTime));
      durationRange.value = playerCurrentTime;
    }, 1000);
    event.target.setVolume(volumeValue);
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
  playBtn.textContent = "Pause";
};
const pauseLogic = () => {
  playBtn.classList.remove("pause");
  playBtn.classList.add("play");
  playBtn.textContent = "Play";
};
playBtn.addEventListener("click", () => {
  if (ytId === "") return;
  if (playBtn.className === "play") {
    playLogic();
    player.playVideo();
  } else {
    pauseLogic();
    player.pauseVideo();
  }
});
stopBtn.addEventListener("click", () => {
  player.stopVideo();
  pauseLogic();
  currentTime.innerText = "00:00";
  totalTime.innerText = "00:00";
  durationRange.value = 0;
});
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
