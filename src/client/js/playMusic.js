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
let settingTime = 0;

musicContainerArray.forEach((element) => {
  element.querySelector("#musicTitle").addEventListener("click", () => {
    const newId = element.dataset.ytid;
    playLogic();
    updatePlayerWithNewId(newId);
    console.log(player);
  });
});

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

function updateCurrentTime() {
  if (player && typeof player.getCurrentTime === "function") {
    const currentTimeFormatted = new Date(player.getCurrentTime() * 1000)
      .toISOString()
      .substring(14, 19);
    currentTime.innerText = currentTimeFormatted;
  }
  // 다음 리페인트 전에 업데이트 요청
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
      onStateChange: onPlayerStateChange,
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
  if (event.target.videoTitle) {
    const formatedTime = new Date(event.target.getDuration() * 1000)
      .toISOString()
      .substring(14, 19);
    totalTime.innerText = formatedTime;
    durationRange.max = Math.floor(event.target.getDuration());
  }
  requestAnimationFrame(updateCurrentTime);
}

// 5. The API calls this function when the player's state changes.
//    The function indicates that when playing a video (state=1),
//    the player should play for six seconds and then stop.
let intervalId;
function onPlayerStateChange(event) {
  if (event.data == YT.PlayerState.PLAYING) {
    // 기존에 실행 중인 setInterval이 있다면 중지
    clearInterval(intervalId);

    // 매초마다 동영상의 현재 시간을 확인하는 setInterval 시작
    intervalId = setInterval(() => {
      const currentTime = player.getCurrentTime();
      console.log("Current Time:", Math.round(currentTime));
      durationRange.value = currentTime;
    }, 1000);
  } else {
    // 플레이어가 일시정지 상태라면 setInterval 중지
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
