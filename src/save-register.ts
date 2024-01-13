import fse from "fs-extra"

import type { Breakpoint, Cache, Config, OutputTypes } from "./types"
import { BREAKPOINTS, IMAGES_REGISTER_FILE, PROCESS_TYPE } from "./const"

interface Size {
  w: number
  h: number
}

interface RegisterItem {
  e: OutputTypes[]
  b?: Breakpoint[]
  s?: Partial<Record<Breakpoint, Size>>
  w: number
  h: number
}

type Register = Record<string, RegisterItem>

export function saveRegister(
  cache: Cache,
  { useImageRegister }: Config,
  prettyRegister?: boolean
) {
  let register: Register = {}

  if (useImageRegister) {
    Object.keys(cache).forEach((key) => {
      let item = cache[key]
      let shortPath = item.filename

      if (item.process === PROCESS_TYPE.defined) {
        let bp: Breakpoint | null = null

        for (let i = 0; i < BREAKPOINTS.length; i++) {
          const _bp = BREAKPOINTS[i]

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

        let ref = register[shortPath]

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
      } else {
        register[shortPath] = {
          w: item.size.width,
          h: item.size.height,
          e: [...item.types].reverse(),
        }
      }
    })
  }

  fse.writeJsonSync(IMAGES_REGISTER_FILE, register, prettyRegister ? { spaces: 2 } : {})
}
