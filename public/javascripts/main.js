
import * as tts from './tts.js'
import { recognition } from './speechrecognizer.js'

let mic_switch = document.getElementById('switch')
let transcript = document.getElementById('transcript')

/* configure tts */
tts.setup()

mic_switch.addEventListener('click', function (e) {
    console.log('mic_switch state', mic_switch.checked)
    if (mic_switch.checked) {
        console.log('Mic On.');
        recognition.start();
    }
    else {
        console.log('Mic Off.');
        transcript.innerHTML = null;
        recognition.stop();
    }
})

// error button handlers
prompt1.addEventListener('click', function (e) {
    tts.speak(prompt1.innerHTML)
})

prompt2.addEventListener('click', function (e) {
    tts.speak(prompt2.innerHTML)
})

prompt3.addEventListener('click', function (e) {
    tts.speak(prompt3.innerHTML)
})

prompt4.addEventListener('click', function (e) {
    tts.speak(prompt4.innerHTML)
})