// Verify devices permissions access

const devicesStatus = document.querySelector('.devices-status');

const snackbar = () => {
    setTimeout(() => {
        devicesStatus.classList.add('hide');
    }, 10000); // 10s before disappear
};
// Check access permissions
navigator.permissions.query({ name: 'microphone' }).then(function(result) {
    // console.log(result)
    if (result.state == 'granted') {
        devicesStatus.innerHTML = 'Devices Access Granted.';
        // Clear after 10s
        snackbar();
    } else if (result.state == 'prompt') {
        devicesStatus.innerHTML = 'Acept Access devices access request.';
        // Clear after 10s
        snackbar();
    } else if (result.state == 'denied') {
        devicesStatus.innerHTML = 'Please Enable Microphone Device.';
        // Clear after 10s
        snackbar();
    }
});

// Select buttons
const title = document.querySelector('.title');
const rec = document.querySelector('.rec');
const stop = document.querySelector('.stop');
const audioPlay = document.querySelector('.audio');
const stopwatch = document.querySelector('.stopwatch');

// Type of media to rec
let typeOfMedia = {
    audio: true
        //, video: true
};
// Create chunks audio container
let chunks = [];
// Media options
var options = {
        audioBitsPerSecond: 128000,
        videoBitsPerSecond: 2500000,
        mimeType: 'audio/webm'
    }
    // Download counter
let counter = 0;

//
// ─── REC FUNCTION ───────────────────────────────────────────────────────────────

// RecStream init
let recStream;

const recFunction = async() => {
    try {
        // Access to computer devices
        const mediaDevices = await navigator.mediaDevices.getUserMedia(typeOfMedia)
        if (mediaDevices.active === true) {
            // The MediaRecorder() constructor creates a new MediaRecorder object that will record a specified MediaStream. 
            recStream = new MediaRecorder(mediaDevices, options);
            //console.log(recStream)
            recStream.ondataavailable = e => {
                    // console.log(e)
                    // Push media data inside the array
                    chunks.push(e.data);
                    // If state inactive stop recording
                    if (recStream.state == 'inactive') {
                        // console.log(chunks)
                        // Create a new Blob with the array created
                        let blob = new Blob(chunks, { type: 'audio/webm' });
                        // Create a Playback and pass it the blob
                        createAudioElement(URL.createObjectURL(blob))
                    }
                }
                // Start Recording in 1s
                // recStream.start(1000)
                // Start rec now
            recStream.start()
        }
    } catch (error) {
        if (error) console.log(error);
    }
}

// Link styles
let linkStyles = "display: block; padding: 10px; color:red; text-decoration: none; "
    //
    //─── FUNCTION TO CREATE AN AUDIO ELEMENT TO PLAYBACK AND DOWNLOAD RECORDING ─────

function createAudioElement(blobUrl) {
    const divEl = document.createElement('div');
    divEl.className = 'div-audio'
    const downloadEl = document.createElement('a');
    downloadEl.style = linkStyles;
    downloadEl.innerHTML = `Download-${counter = counter + 1}`;
    downloadEl.download = `Audio-${counter}.webm`;
    downloadEl.href = blobUrl;
    const audioEl = document.createElement('audio');
    audioEl.className = 'audio'
    audioEl.controls = true;
    const sourceEl = document.createElement('source');
    sourceEl.src = blobUrl;
    sourceEl.type = 'audio/webm';
    audioEl.appendChild(sourceEl);
    // document.body.appendChild(audioEl);
    // document.body.appendChild(downloadEl);
    divEl.appendChild(audioEl)
    divEl.appendChild(downloadEl)
    document.body.appendChild(divEl);
}

// REC CLICK BUTTON EVENT LISTENER
rec.onclick = e => {
        // During registration disable rec button
        rec.disabled = true;
        // Change background color
        rec.style.backgroundColor = 'orange';
        // Aninate rec button
        rec.classList.add('scale');
        // Enable stop button (default disabled)
        stop.disabled = false;
        // Change stop color back
        stop.style.background = '#292964';
        stop.style.color = '#ffffff';
        // Change title back color
        title.style.color = '#2196F3'
            // Star recording
        recFunction()
            // START STOPWATCH
        clearInterval(swInterval);
        swIternal = setInterval(stopwatchFunction, 1000);
    }
    // STOP REC BUTTON EVENT LISTENER
stop.onclick = e => {
    // Enable rec button
    rec.disabled = false;
    // Restore red color on rec button
    rec.style.backgroundColor = 'red';
    // Disable rex animation 
    rec.classList.remove('scale');
    // Disable stop button
    stop.disabled = true;
    // Change stop color back
    stop.style.backgroundColor = '#292929';
    stop.style.color = 'rgb(103, 103, 103)';
    // Change back title color
    title.style.color = '#313142'
        // STOP and Reset STOPWATCH
    clearInterval(swIternal);
    sec = 0;
    min = 0;
    // Stop Recording
    recStream.stop()

}

// STOPWATCH
let swInterval;
let displayStopwatch;
let sec = 0;
let min = 0;
let stopwatchFunction = () => {
    sec++
    if (sec <= 9) {
        sec = '0' + sec;
    }
    if (sec === 60) {
        sec = 0;
        min++
        if (min <= 9) {
            min = '0' + min;
        }
    }
    if (min === 60) {
        min = 0;
    }
    displayStopwatch = 'min: ' + min + ' : ' + 'sec: ' + sec;
    // writing output to screen
    stopwatch.innerHTML = displayStopwatch;
};