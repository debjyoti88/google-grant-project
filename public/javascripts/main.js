import {formatText} from './stringutil.js'
import {quill, Delta} from './quill.js'

let lastHypothesisLength = 0;
let socket = io.connect('http://172.31.102.12:3000')

socket.on('utterance', (data) => {
    quill.updateContents(new Delta()
        .retain(quill.getLength() - lastHypothesisLength - 1)
        .delete(lastHypothesisLength)
        .insert(data.hypothesis, {'color': 'red'})
    );

    lastHypothesisLength = data.hypothesis.length

    if (data.finalStatus === true) {
        console.log('hypothesis: ' + data.hypothesis);
        
        quill.updateContents(new Delta()
            .retain(quill.getLength() - lastHypothesisLength - 1)
            .delete(lastHypothesisLength)
            .insert(' ')
            .insert(data.hypothesis)
        );

        quill.setText(formatText(quill.getText()) + ' ')
        lastHypothesisLength = 0
    }    
})

socket.on('pushQuill', (data) => {
    quill.setText(data);
})

