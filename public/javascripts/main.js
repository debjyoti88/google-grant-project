import {data} from './data.js'

/* acquire dom elements */
var btn1 = document.getElementById('btn1')
var btn2 = document.getElementById('btn2')
var btn3 = document.getElementById('btn3')

/* Quill setup */
var options = {
    theme: 'snow',
    modules: {
        history: {
            delay: 1500,
            maxStack: 100,
        }
    }
};
var quill = new Quill('#editor',options);
var Delta = Quill.import('delta');

/* Task Button Handlers */
btn1.addEventListener('click', function(e) {
    quill.setText(data[0].trig)
})

btn2.addEventListener('click', function(e) {
    quill.setText(data[1].trig)
})

btn3.addEventListener('click', function(e) {
    quill.setText(data[2].trig)
})

