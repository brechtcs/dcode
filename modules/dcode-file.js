import assert from 'dat://f7a6cde10e31b4244ebe9e6aa42ff8dfe6b417730852bd59e8030df4f9987b26/modules/assert.js'
import parsePath from 'dat://f7a6cde10e31b4244ebe9e6aa42ff8dfe6b417730852bd59e8030df4f9987b26/modules/dterm-parse-path.js'

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
    return this.archive.readFile(this.path)
  }
  
  async save (contents) {
    this.unsaved = false
    return this.archive.writeFile(this.path, contents)
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
export function test () {
  var file = new DcodeFile(`${window.location.origin}/path/to/barf.js`)
  assert(file.base === 'barf.js', 'wrong basename')
  assert(file.dir === 'path/to', 'wrong dirname')
}