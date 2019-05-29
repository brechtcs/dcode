export async function bootstrapEditor (file, opts) {
  let el = opts.el
    ? document.querySelector(opts.el)
    : document.body

  if (opts.keymap) {
    await import(`/vendor/codemirror-v5.45.0/keymap/${opts.keymap}.js`)
  }
  if (opts.mode && opts.mode !== 'null') {
    await import(`/vendor/codemirror-v5.45.0/mode/${opts.mode}/${opts.mode}.js`)
    el.classList.add(opts.mode)
  }

  return CodeMirror(el, {
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
}
