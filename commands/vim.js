import joinPath from 'dat://f7a6cde10e31b4244ebe9e6aa42ff8dfe6b417730852bd59e8030df4f9987b26/modules/join-path.js'

export default function (opts, location) {
  var origin = new URL(import.meta.url).origin
  var path = joinPath(window.location.pathname, location)
  window.open(origin + path)
}
