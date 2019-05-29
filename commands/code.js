import {resolveUrl} from 'dat://dfurl.hashbase.io/modules/url.js'

export default async function (opts, location) {
  let {cwd, home} = (await import(`${window.location.origin}/modules/public-state.js`)).default
  let file = resolveUrl(location, cwd, home)

  if (await file.isDirectory()) {
    throw new Error('dcode cannot open directories')
  }
  file.app = import.meta.url
  file.search = `?keymap=${opts.keymap || 'sublime'}`
  return file.open()
}
