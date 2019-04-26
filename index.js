import Editor from './modules/dcode-editor.js'
import File from './modules/dcode-file.js'

var file = new File(window.location.pathname)
var params = new URLSearchParams(window.location.search)
var keymap = params.get('keymap')
var mode = params.get('mode') || guessMode()

document.addEventListener('DOMContentLoaded', async function () {
  var editor = await Editor(file, {keymap, mode})
  editor.focus()

  window.addEventListener('focus', function () {
    editor.focus()
  })

  window.addEventListener('beforeunload', function (e) {
    var msg = 'Unsaved changes'
    if (file.unsaved) {
      e.returnValue = msg
      return msg
    }
  })
})

function guessMode () {
  var obj = CodeMirror.findModeByExtension(file.ext)
  return obj && obj.mode
}