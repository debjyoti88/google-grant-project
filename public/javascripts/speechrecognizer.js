import * as tts from './tts.js'
import { quill, Delta } from './quill.js';
import { formatText } from './stringutil.js'
import { getSocket } from './socket.js'


/* Speech recognizer setup */
var SpeechRecognition = SpeechRecognition || webkitSpeechRecognition;

export const recognition = new SpeechRecognition();

recognition.continuous = true;
recognition.lang = 'en-US';
recognition.interimResults = true;
recognition.maxAlternatives = 1;

let lastHypothesisLength = 0;
let socket = getSocket();
let selectionIndex = 0;

/* Recognition Events */
recognition.onresult = function(event) {
    var last = event.results.length - 1;
    var hypothesis = event.results[last][0].transcript.trim();

    tts.pause()

    transcript.innerHTML = hypothesis
    socket.emit('utterance', {'hypothesis':hypothesis, 'finalStatus': false})

    quill.updateContents(new Delta()
        .retain(quill.getLength() - lastHypothesisLength - 1)
        .delete(lastHypothesisLength)
        .insert(hypothesis, {'color': 'red'})
    );

    lastHypothesisLength = hypothesis.length

    if (event.results[last].isFinal) {
        selectionIndex = quill.getSelection();
        console.log('hypothesis: ' + hypothesis);
        transcript.innerHTML = hypothesis
        socket.emit('utterance', { 'hypothesis': hypothesis, 'finalStatus': true })
        
        quill.updateContents(new Delta()
            .retain(quill.getLength() - lastHypothesisLength - 1)
            .delete(lastHypothesisLength)
            .insert(' ')
            .insert(hypothesis)
        );

        quill.setText(formatText(quill.getText()) + ' ')
        quill.setSelection(selectionIndex);

        lastHypothesisLength = 0
    }
}

recognition.onstart = function() {
    console.log('Speech recognition started.');
}

recognition.onend = function() {
    if ( document.getElementById('switch').checked ) {
        console.log('Restarting Speech Recognizer...');
        recognition.start()
    }
    else {
        recognition.stop()
        console.log('Speech recognition stopped.');
    }
}

sendbtn.addEventListener('click', function (e) {
    socket.emit('pushQuill', quill.getText())
})