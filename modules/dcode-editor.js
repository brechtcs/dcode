export default async function (file, opts) {
  await import(`/shared/codemirror-v5.45.0/keymap/${opts.keymap}.js`)

  var el = opts.el
    ? document.querySelector(opts.el)
    : document.body

  var editor = CodeMirror(el, {
    mode: file.mime,
    keyMap: opts.keymap,
    lineNumbers: true,
    matchBrackets: true,
    autoCloseBrackets: true,
    autoCloseTags: true,
    showCursorWhenSelecting: true,
    showTrailingSpace: true
  })

  updateTitle(file)
  editor.setValue(await file.open())
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

  return editor
}

function updateTitle (file) {
  document.title = (file.unsaved ? '* ' : '') + file.base + ' - dcode'
}
