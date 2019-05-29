import {bootstrapEditor} from './modules/editor.js'
import {parseUrl} from 'dat://dfurl.hashbase.io/modules/url.js'

const AUTOSAVE_DEBOUNCE_MS = 1000

let editor, file = parseUrl(window.location)
let params = new URLSearchParams(window.location.search)
let keymap = params.get('keymap')
let mode = params.get('mode') || guessMode()

document.addEventListener('DOMContentLoaded', async function () {
  CodeMirror.commands.save = saveDocument

  let isFile = await file.isFile()
  editor = await bootstrapEditor(file, {keymap, mode})
  editor.setValue(isFile ? await file.read() : '')
  editor.on('change', debounce(saveDocument, AUTOSAVE_DEBOUNCE_MS))
  editor.focus()

  window.addEventListener('focus', function () {
    editor.focus()
  })

  window.addEventListener('beforeunload', async function () {
    await saveDocument()
  })

  document.title = file.base + ' - dcode'
})

async function saveDocument () {
  console.info('saving')
  await file.write(editor.getValue())
}

function guessMode () {
  let obj = CodeMirror.findModeByExtension(file.ext)
  return obj && obj.mode
}

/**
 * Helper functions:
 */
function debounce (fn, ms) {
  let timeout

  return function () {
    const args = arguments
    clearTimeout(timeout)
    timeout = setTimeout(function () {
      fn.apply(null, args)
    }, ms)
  }
}