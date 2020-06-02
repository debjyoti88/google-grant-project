import * as tts from './tts.js'

/* Quill setup */
var toolbarOptions = [
    ['bold', 'italic', 'underline'],                // toggled buttons
    [{ 'color': [] }],
    ['clean']                                         // remove formatting button
];

var options = {
    theme: 'snow',
    modules: {
        toolbar: toolbarOptions,
        history: {
            delay: 1500,
            maxStack: 100,
        }
    }
};

export var quill = new Quill('#editor', options);
export var Delta = Quill.import('delta');

let selectionIndex = 0;
export const getSelectionIndex = () => selectionIndex;

document.getElementById('editor').addEventListener('click', (e) => {
    if (tts.isSpeaking()) tts.pause();

    selectionIndex = quill.getSelection().index
    console.log(quill.getSelection().index)

    if (e.metaKey) {
        var startOfWord = quill.getText().lastIndexOf(' ', selectionIndex) + 1
        tts.speak(quill.getText(startOfWord))
    }
});

document.getElementById('editor').addEventListener('dblclick', (e) => {
    selectionIndex = quill.getSelection().index
    tts.speak(quill.getText(selectionIndex))
})

document.getElementById('editor').addEventListener('keypress', (e) => {
    quill.focus();
    if (tts.isSpeaking()) tts.pause();
});



