import joinPath from 'dat://dterm.hashbase.io/modules/join-path.js'

export default function (opts, location) {
  var origin = new URL(import.meta.url).origin
  var path = joinPath(window.location.pathname, location)
  window.open(origin + path)
}
