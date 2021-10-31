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

function success (stream) {
  video.srcObject = stream
  tmpStream = stream
  video.onloadedmetadata = () => {
    console.log('loadedmetadata')
    video.play();
    loadAndPredict()
  };
}

function failure (err) {
  alert(err.name + ':' + err.message)
}

function setCameraMode () {
  if (navigator.userAgent.match(/iPhone|Android.+Mobile/)) {
    video.setAttribute('style');
    return { exact: "environment" };
  } else {
    video.setAttribute('style', 'transform: scaleX(-1)')
    return 'user';
  }
}

function setSize () {
  const w = window.innerWidth;
  const h = window.innerHeight;
  video.setAttribute('width', w);
  video.setAttribute('height', h);
  canvas.setAttribute('width', w);
  canvas.setAttribute('height', h);
  return {
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
  constraints.video.facingMode = setCameraMode()
  constraints.video = setSize();

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
  const config = setSize();
  const [track] = tmpStream.getVideoTracks();
  track.applyConstraints(config)
    .then(() => {
      console.log(track.getSettings());
    });
});
