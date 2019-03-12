// global variables
var voice;
var rate = 0.9;
var utterThis = new SpeechSynthesisUtterance('');
let synth = window.speechSynthesis;

/* Speech synthesizer setup */
export function setup() {
    function setSpeech() {
        return new Promise(
            function (resolve, reject) {
                let id;
                id = setInterval(() => {
                    if (synth.getVoices().length !== 0) {
                        resolve(synth.getVoices());
                        clearInterval(id);
                    }
                }, 10);
            }
        )
    }

    let s = setSpeech();
    // s.then((voices) => console.log(voices));  
    s.then((voices) => {
        voice = voices.filter(x => x.default)[0]
        console.log(voice)
    });  
}

export function speak(text) {
    utterThis = new SpeechSynthesisUtterance('');
    
    utterThis.voice = voice;
    utterThis.rate = rate;
    utterThis.text = text;

    synth.speak(utterThis);
}

export function isPaused() {
    return synth.paused
}

export function isSpeaking() {
    return synth.speaking
}

export function pause() {
    synth.cancel()
}

utterThis.onerror = function(event) {
    console.log('An error has occurred with the speech synthesis: ' + event.error);
}