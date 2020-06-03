
import * as tts from './tts.js'
import { recognition } from './speechrecognizer.js'

let mic_switch = document.getElementById('switch')
let transcript = document.getElementById('transcript')

/* configure tts */
tts.setup()
