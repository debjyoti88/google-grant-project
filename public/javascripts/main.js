import {data} from './data.js'
import {diffString, diffString2} from './diff.js'

/* acquire dom elements */
var btn1 = document.getElementById('btn1')
var btn2 = document.getElementById('btn2')
var btn3 = document.getElementById('btn3')

/* Dev */ 
// var test = document.getElementById('test')


/* Quill setup */
var toolbarOptions = [
    ['bold', 'italic', 'underline'],                // toggled buttons
    // ['blockquote', 'code-block'],

    // [{ 'header': 1 }, { 'header': 2 }],               // custom button values
    // [{ 'list': 'ordered'}, { 'list': 'bullet' }],
    // [{ 'script': 'sub'}, { 'script': 'super' }],      // superscript/subscript
    // [{ 'indent': '-1'}, { 'indent': '+1' }],          // outdent/indent
    // [{ 'direction': 'rtl' }],                         // text direction

    // [{ 'size': ['small', false, 'large', 'huge'] }],  // custom dropdown
    // [{ 'header': [1, 2, 3, 4, 5, 6, false] }],

    [{ 'color': [] }], 
    // { 'background': [] }],          // dropdown with defaults from theme
    // [{ 'font': [] }],
    // [{ 'align': [] }],

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

var quill = new Quill('#editor',options);
var Delta = Quill.import('delta');

// quill link setup
let Inline = Quill.import('blots/inline');
class LinkBlot extends Inline {
    static create() {
        let node = super.create();

        // Sanitize url if desired
        node.setAttribute('href', '#');

        // Okay to set other non-format related attributes
        // node.setAttribute('target', '_blank');
        // node.setAttribute('correction', arr[1]);
        node.setAttribute('class', 'error');
        return node;
    }
    
    static formats(node) {
        return node.getAttribute('href');
    }
}

LinkBlot.blotName = 'link';
LinkBlot.tagName = 'a';
Quill.register(LinkBlot);

/* global variables */
var correctionMap = [];

/* Task Button Handlers */
btn1.addEventListener('click', function(e) {
    // quill.setText(data[0].trig)
    generateCorrectionMap(data[0])
})

btn2.addEventListener('click', function(e) {
    // quill.setText(data[1].trig)
    generateCorrectionMap(data[1])
})

btn3.addEventListener('click', function(e) {
    // quill.setText(data[2].trig)
    generateCorrectionMap(data[2])
})

document.getElementById('editor').addEventListener('click', (e) => {
    // if (e.metaKey)
    //     tts.readSelection()
    // else
    
    var clickedAt = quill.getSelection().index
    if (quill.getContents(clickedAt).ops[0].attributes) {

        /* recompute line breaks */ 
        var splitRegex = /[\.;!]/g
        var text = quill.getText();

        var lineEnds = []
        var match = splitRegex.exec(text)
        while (match != null) {
                lineEnds.push(match.index)
                match = splitRegex.exec(text);
        }

        // compute line number of current selection
        var linenum = lineEnds.filter(x => clickedAt > x).length;
        // console.log('line number', linenum)

        // compute start and end of embedded triggers 
        var contents = quill.getContents();
        // console.log('contents', contents)
        var acc = 0
        var triggerRange = []

        contents.ops.filter(x => {
            if (typeof x.attributes === 'object')
                triggerRange.push({start: acc, end: acc + x.insert.length})
            acc += x.insert.length
        })
        // console.log('triggerRange', triggerRange)

        var range = triggerRange.filter(x => clickedAt >= x.start && clickedAt <= x.end)[0]
        var key = quill.getText(range.start, range.end-range.start)
        // console.log('key', key, 'length of key', key.length)

        var correction = correctionMap[linenum][key]
        quill.updateContents(new Delta()
            .retain(range.start)
            .delete(range.end - range.start)
            .insert(correction)
        )
    }
});


/* Dev */ 
/*
test.addEventListener('click', function(e) {
    
})*/

function generateCorrectionMap(dataobj) {
    console.log('original data ::', dataobj.orig)

    var splitRegex = /\b.*?\b[\.;!]/g
    var lines = {}
    lines.orig = dataobj.orig.match(splitRegex)
    lines.trig = dataobj.trig.match(splitRegex)
    // console.log('orig split', lines.orig)
    // console.log('trig split', lines.trig)

    
    for (var i=0; i < lines.orig.length; i++) {
        // console.log('orig line', i, ':', lines.orig[i])
        // console.log('trig line', i, ':', lines.trig[i])

        var diff = diffString(lines.orig[i], lines.trig[i])
        // console.log('diff', diff)

        diff = diff.replace(/\n/g, '')
        diff = diff.replace(/\s\s+/g, ' ')
        diff = diff.replace(/<\/(\w+)><\1>/g, '')
        // console.log('diff', diff)

        if (!(diff.match(/<.*?>/g)))
            continue;

        var regmod = /(\b\w+\b)*(?:^|\s)(<.*?>)(?:\s|$)(?=(\b\w+\b)*)/g

        var modlist = []
        var match = regmod.exec(diff)
        while (match != null) {
                modlist.push({
                    leading: match[1],
                    modif: match[2],
                    trailing: match[3]
                })
                match = regmod.exec(diff);
        }

        correctionMap[i] = {}  // {'error': 'correction'}
        var reFirstTag = /<(\w{3})>/g
        modlist.map(x => {
            // extract the first tag
            match = reFirstTag.exec(x.modif)
            reFirstTag.lastIndex = 0;
            var firstTag = match.pop()
            // console.log('firstTag', firstTag)

            var leading = x.leading;
            // console.log('leading word', leading)

            var trailing = x.trailing;
            // console.log('trailing word', trailing)

            // check if both or any one tag is present
            if (x.modif.match(/></g) || firstTag === 'ins') {
                var err = /<ins>(.*)<\/ins>/g.exec(x.modif)[1]
                // console.log('err', err)

                if (firstTag === 'del')
                    correctionMap[i][err] = /<del>(.*)<\/del>/g.exec(x.modif)[1]
                else
                    correctionMap[i][err] = ''
            }
            else if (firstTag === 'del') {
                if (trailing)
                    correctionMap[i][trailing] = /<del>(.*)<\/del>/g.exec(x.modif)[1] + trailing
                else if (leading)
                    correctionMap[i][leading] = leading + /<del>(.*)<\/del>/g.exec(x.modif)[1]
            }
        })
    }

    console.log('correctionMap', correctionMap)

    /* set data in quill editor */ 
    var acc_line = 0;
    quill.setText('')
    lines.trig.map( (line, i) => {
        quill.updateContents(new Delta()
            .retain(quill.getText().length -1)
            .insert(line)
            .insert(' ')
        );

        if (correctionMap[i]) {
            // console.log(Object.keys(correctionMap[i]))
            Object.keys(correctionMap[i]).map(x => {
                // console.log('searching', x, 'in', line)
                var pos = line.indexOf(x)
                // console.log('found in pos', pos, ' :: length of x', x.length)
                quill.updateContents(new Delta()
                    .retain(acc_line)
                    .retain(pos)
                    .retain(x.length, {color: 'red', 'link': true})
                );
            })
        }

        // console.log('line ['+(i+1)+'] length ', line.length)
        acc_line += line.length+1;
    })
}

/* dev */
// var a = 'That cannot be said and done.'
// var b = 'cannot be said and done.'
// console.log('test diff ::', diffString(a,b))