const tag = document.createElement("script");
const playBtn = document.getElementById("playBtn");
const stopBtn = document.getElementById("stopBtn");
const muteBtn = document.getElementById("muteBtn");
const volumeRange = document.getElementById("volume");
const durationRange = document.getElementById("duration");
const timeText = document.getElementById("time");

const musicContainer = document.querySelectorAll(".musicContainer");
const musicContainerArray = [...musicContainer];

let ytId = "";
let volumeValue = volumeRange.value;
let isMute = false;

musicContainerArray.forEach((element) => {
  element.querySelector("#musicTitle").addEventListener("click", () => {
    const newId = element.dataset.ytid;
    playLogic();
    updatePlayerWithNewId(newId);
  });
});

// musicTitle.addEventListener("click", () => {
//   ytId = musicYtId.innerText;
//   console.log(ytId);
// });

tag.src = "https://www.youtube.com/iframe_api";
const firstScriptTag = document.getElementsByTagName("script")[0];
firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);

// 3. This function creates an <iframe> (and YouTube player)
//    after the API code downloads.
let player;
function onYouTubeIframeAPIReady() {
  player = new YT.Player("player", {
    height: "360",
    width: "640",
    videoId: ytId,
    events: {
      onReady: onPlayerReady,
      onStateChange: onPlayerStateChange,
    },
  });
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
  console.log(player);
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

const handleDuration = () => {
  console.log(player.getCurrentTime());
  console.log(player.getDuration());
};

function updatePlayerWithNewId(newYtId) {
  if (player) {
    // 이미 생성된 플레이어가 있다면 멈추고 제거
    player.stopVideo();
    player.destroy();
  }

  ytId = newYtId;

  // 새로운 ytId로 플레이어 생성
  player = new YT.Player("player", {
    height: "360",
    width: "640",
    videoId: ytId,
    events: {
      onReady: onPlayerReady,
      //onStateChange: onPlayerStateChange,
    },
  });
}

// 4. The API will call this function when the video player is ready.
function onPlayerReady(event) {
  event.target.playVideo();
  event.target.setVolume(volumeValue);
  if (isMute) {
    event.target.mute();
  } else {
    event.target.unMute();
  }
}

// 5. The API calls this function when the player's state changes.
//    The function indicates that when playing a video (state=1),
//    the player should play for six seconds and then stop.
let done = false;
function onPlayerStateChange(event) {
  if (event.data == YT.PlayerState.PLAYING && !done) {
    setTimeout(stopVideo, 6000);
    done = true;
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
});
