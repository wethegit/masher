import fse from "fs-extra"

import type { Cache, Config, OutputTypes } from "./types"
import { IMAGES_REGISTER_FILE } from "./const"

interface Size {
  w: number
  h: number
}

interface RegisterItem {
  e: OutputTypes[]
  b?: string[]
  s?: Partial<Record<string, Size>>
  w: number
  h: number
}

type Register = Record<string, RegisterItem>

export function saveRegister(cache: Cache, { breakpoints }: Config) {
  const register: Register = {}

  Object.keys(cache).forEach((key) => {
    const item = cache[key]
    let shortPath = item.filename

    let bp: string | null = null

    for (let i = 0; i < breakpoints.length; i++) {
      const _bp = breakpoints[i]

      if (shortPath.includes(_bp)) {
        shortPath = shortPath.replace("-" + _bp, "")
        bp = _bp
        break
      }
    }

    if (!register[shortPath]) {
      register[shortPath] = {
        e: [...item.types].reverse(),
        w: 0,
        h: 0,
      }
    }

    const ref = register[shortPath]

    if (bp) {
      if (!ref.b) ref.b = []
      ref.b.push(bp)

      const size: Size = {
        w: item.size.width * (item.is2x ? 0.5 : 1),
        h: item.size.height * (item.is2x ? 0.5 : 1),
      }

      if (!ref.s) ref.s = {}

      ref.s[bp] = size
    } else {
      register[shortPath].w = item.size.width * (item.is2x ? 0.5 : 1)
      register[shortPath].h = item.size.height * (item.is2x ? 0.5 : 1)
    }
  })

  fse.writeJsonSync(IMAGES_REGISTER_FILE, register, { spaces: 2 })
}
