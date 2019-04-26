export default async function (file, opts) {
  var el = opts.el
    ? document.querySelector(opts.el)
    : document.body

  if (opts.keymap) {
    await import(`/shared/codemirror-v5.45.0/keymap/${opts.keymap}.js`)
  }
  if (opts.mode) {
    await import(`/shared/codemirror-v5.45.0/mode/${opts.mode}/${opts.mode}.js`)
    el.classList.add(opts.mode)
  }

  var editor = CodeMirror(el, {
    mode: opts.mode,
    keyMap: opts.keymap,
    lineWrapping: opts.mode === 'markdown',
    lineNumbers: opts.mode !== 'markdown',
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
