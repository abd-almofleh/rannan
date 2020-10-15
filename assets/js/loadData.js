const createPlayer = (containerId, path) =>{
  console.log(containerId);
  var wavesurfer = WaveSurfer.create({
    container: '#'+containerId,
    waveColor: '#F39200',
    progressColor: '#00A19A',
    barWidth:1,
    barRadius:1,
    cursorColor:'#000',
    height:100
  });
  wavesurfer.load('./assets/voice/'+path);
  return wavesurfer;
}

const createContainer = (containerId, title)=>{
  var col4 = document.createElement('div');
  col4.classList.add('col-4');

  //container
  var waveform = document.createElement('div');
  waveform.classList.add('waveform');
  waveform.classList.add('shadow');
  waveform.id = containerId;
  col4.appendChild(waveform);
  
  
  
  var audioPlayer = document.createElement('div');
  audioPlayer.classList.add('audio-player');
  audioPlayer.classList.add('shadow');
  col4.appendChild(audioPlayer);
  
  var timeLine = document.createElement("div");
  timeLine.classList.add('timeline');
  audioPlayer.appendChild(timeLine);

  var progress = document.createElement('div');
  progress.classList.add('progress');
  timeLine.appendChild(progress);


  var controls = document.createElement('div');
  controls.classList.add('controls');
  audioPlayer.appendChild(controls);

  var playContainer = document.createElement('div');
  playContainer.classList.add('play-container');
  controls.appendChild(playContainer);

  var togglePlay = document.createElement('div');
  togglePlay.classList.add('toggle-play');
  togglePlay.classList.add('play');
  playContainer.appendChild(togglePlay);

  var time = document.createElement('div');
  time.classList.add('time');
  controls.appendChild(time);

  var currentTime = document.createElement('div');
  currentTime.classList.add('current');
  currentTime.innerText = '0:00';
  time.appendChild(currentTime);

  var dividerTime = document.createElement('div');
  dividerTime.classList.add('divider');
  dividerTime.innerText = '/';
  time.appendChild(dividerTime);

  var lengthTime = document.createElement('div');
  lengthTime.classList.add('length');
  time.appendChild(lengthTime);

  var name = document.createElement('div');
  name.classList.add('name');
  console.log(title);
  name.innerText = title;
  controls.appendChild(name);

  var volumeContainer = document.createElement('div');
  volumeContainer.classList.add('volume-container');
  controls.appendChild(volumeContainer);

  var volumeButton = document.createElement('div');
  volumeButton.classList.add('volume-button');
  volumeContainer.appendChild(volumeButton);

  var volume = document.createElement('div');
  volume.classList.add('volume');
  volume.classList.add('icono-volumeMedium');
  volumeButton.appendChild(volume);

  var volumeSlider = document.createElement('div');
  volumeSlider.classList.add('volume-slider');
  volumeContainer.appendChild(volumeSlider);

  var volumePercentage = document.createElement('div');
  volumePercentage.classList.add('volume-percentage');
  volumeSlider.appendChild(volumePercentage);

  return col4;
}

var createEvents = (wave,col)=>{
  wave.on("ready", () => {
    col.querySelector(".time .length").textContent = getTimeCodeFromNum(
      wave.getDuration()
    );
    wave.setVolume(0.75);
  });

  //click on timeline to skip around
  const timeline = col.querySelector(".timeline");
  timeline.addEventListener("mousedown", e => {
    e.preventDefault();
    const timelineWidth = parseInt(window.getComputedStyle(timeline).width);
    const timeToSeek = event.offsetX/ timelineWidth * wave.getDuration();

    var seek = timeToSeek * 100 /wave.getDuration() /100;
    wave.seekTo(seek);
    document.addEventListener('mouseup', stopDraggingTimeLine);

    // call a function whenever the cursor moves:
    document.onmousemove = event =>{
      const timelineWidth = parseInt(window.getComputedStyle(timeline).width);
      const timeToSeek = event.offsetX/ timelineWidth * wave.getDuration();    

      var seek = timeToSeek * 100 /wave.getDuration() /100;
      wave.seekTo(seek);
    } 
  });

  //check audio percentage and update time accordingly
  setInterval(() => {
    const progressBar = col.querySelector(".progress");
    progressBar.style.width = wave.getCurrentTime() / wave.getDuration() * 100 + "%";
    col.querySelector(".time .current").textContent = getTimeCodeFromNum(
      wave.getCurrentTime()
    );
  }, 500);


  //click volume slider to change volume
  const volumeSlider = col.querySelector(".controls .volume-slider");
  console.log(volumeSlider);
  volumeSlider.addEventListener('click', e => {
    console.log("vol");
    const sliderWidth = window.getComputedStyle(volumeSlider).width;
    const newVolume =e.offsetX / parseInt(sliderWidth);
    wave.setVolume(newVolume);
    console.log(newVolume);
    col.querySelector(".controls .volume-percentage").style.width = newVolume * 100 + '%';
  }, false);


  const playBtn = col.querySelector(".controls .toggle-play");
  playBtn.addEventListener("click", () => {
    if (!wave.isPlaying()) {
      playBtn.classList.remove("play");
      playBtn.classList.add("pause");
      wave.play();
    } else {
      playBtn.classList.remove("pause");
      playBtn.classList.add("play");
      wave.pause();
    }
  },false);
  

  col.querySelector(".volume-button").addEventListener("click", () => {
    const volumeEl = col.querySelector(".volume-container .volume");
    wave.setMute(!wave.getMute());
    if (wave.getMute()) {
      volumeEl.classList.remove("icono-volumeMedium");
      volumeEl.classList.add("icono-volumeMute");
    } else {
      volumeEl.classList.add("icono-volumeMedium");
      volumeEl.classList.remove("icono-volumeMute");
    }
    });

}

function stopDraggingTimeLine(e){
  document.onmouseup = null;
  document.onmousemove = null;
  }

var root = document.getElementById('players')
for (let index = 0; index < data.length; index++) {
  var containerId = "waveform"+index;
  var col = createContainer(containerId,data[index].title);
  root.appendChild(col);
  var wave = createPlayer(containerId, data[index].title);
  createEvents(wave,col)
}

//turn 128 seconds into 2:08
function getTimeCodeFromNum(num) {
  let seconds = parseInt(num);
  let minutes = parseInt(seconds / 60);
  seconds -= minutes * 60;
  const hours = parseInt(minutes / 60);
  minutes -= hours * 60;

  if (hours === 0) 
    return `${minutes}:${String(seconds % 60).padStart(2, 0)}`;
  return `${String(hours).padStart(2, 0)}:${minutes}:${String(seconds % 60).padStart(2, 0)}`;
}
