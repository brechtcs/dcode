import File from '/modules/dcode-file.js'

var file = new File(window.location.pathname)

document.addEventListener('DOMContentLoaded', async function () {
  updateTitle(file)

  var editor = createEditor(file.mime)
  editor.setValue(await file.open())
  editor.focus()

  editor.on('change', function () {
    if (!file.unsaved) {
      file.unsaved = true
      updateTitle(file)
    }
  })

  CodeMirror.commands.save = async function () {
    await file.save(editor.getValue())
    updateTitle(file)
  }

  CodeMirror.Vim.defineEx('quit', 'q', function (cm, ex) {
    closeWindow(ex.args && ex.args.includes('!'))
  })

  CodeMirror.Vim.defineEx('wq', 'wq', async function () {
    await file.save(editor.getValue())
    closeWindow(true)
  })

  window.editor = editor
  window.addEventListener('focus', function () {
    editor.focus()
  })
})

function updateTitle (file) {
  document.title = (file.unsaved ? '* ' : '') + file.base + ' - dcode'
}

function createEditor (mode) {
  return CodeMirror(document.body, {
    lineNumbers: true,
    mode: mode,
    keyMap: 'vim',
    matchBrackets: true,
    autoCloseBrackets: true,
    autoCloseTags: true,
    showCursorWhenSelecting: true
  })
}

function closeWindow (force) {
  if (force || !file.unsaved || confirm('Are you sure you want to close dcode?')) {
    window.close()
  }
}
