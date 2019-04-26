import parsePath from 'dat://dterm.hashbase.io/modules/dterm-parse-path.js'

const EXT = /\.[\w]+$/
const SEP = '/'

export default class DcodeFile {
  constructor (pathname) {
    var {archive, key, path} = parsePath(pathname)

    this.archive = archive
    this.key = key
    this.path = path
    this.unsaved = false
  }

  async open () {
    try {
      return await this.archive.readFile(this.path)
    } catch (err) {
      console.error(err)
      return ''
    }
  }

  async save (contents) {
    this.archive.writeFile(this.path, contents)
    this.unsaved = false
  }

  get base () {
    return this.path.split(SEP).pop()
  }

  get dir () {
    return this.path.split(SEP).slice(0, -1).join(SEP)
  }

  get ext () {
    return this.path.match(EXT)[0]
  }

  get mime () {
    switch (this.ext) {
      case '.css': return 'text/css'
      case '.html': return 'text/html'
      case '.js': return 'application/javascript'
      default: return 'text/plain'
    }
  }

  get name () {
    return this.base.replace(this.ext, '')
  }
}

/**
 * Tests
 */
export function test (t) {
  var file = new DcodeFile(`${window.location.origin}/path/to/barf.js`)
  t.ok(file.base === 'barf.js', 'basename')
  t.ok(file.dir === 'path/to', 'dirname')
}