let useFront = true // フロントをつかっているかどうか 
let tmpStream = null

var canvas = null;
var video = null
var constraints = {
  audio: false,
  video: {
    facingMode: 'user',
    frameRate: { ideal: 10, max: 15 }, // フレームレートを下げる
  }
};

function isSP () {
  return navigator.userAgent.match(/iPhone|Android.+Mobile/);
}

function success (stream) {
  video.srcObject = stream
  tmpStream = stream
  video.onloadedmetadata = () => {
    console.log('loadedmetadata')
    video.width = video.videoWidth;
    video.height = video.videoHeight;
    video.play();
    loadAndPredict()
  };
}

function failure (err) {
  alert(err.name + ':' + err.message)
}

function setVideoOptions () {
  let facingMode = 'user';

  if (isSP()) {
    facingMode = { exact: "environment" };
  }

  return {
    facingMode: facingMode,
    frameRate: { ideal: 10, max: 15 }, // フレームレートを下げる
    width: {
      min: 0,
      max: window.innerWidth,
    },
    height: {
      min:0,
      max: window.innerHeight, 
    },
    aspectRatio: window.innerWidth / window.innerHeight,
  }
}

function syncCamera (video, isFront) {
  constraints.video = setVideoOptions();

  if (tmpStream !== null) {
    tmpStream.getVideoTracks().forEach(camera => {
      camera.stop()
    })
  }

  //  カメラの映像を取得
  navigator.mediaDevices.getUserMedia(constraints)
    .then(success)
    .catch(failure)
}

document.addEventListener('DOMContentLoaded', () => {
  video = document.getElementById('video');
  canvas = document.getElementById('canvas');
  syncCamera()
});

window.addEventListener('resize', () => {
  const config = setVideoOptions();
  const [track] = tmpStream.getVideoTracks();
  track.applyConstraints(config)
    .then(() => {
      console.log(track.getSettings());
    });
});
