import fse from "fs-extra"

import type { Cache, Config } from "./types"
import { CACHE_FILE } from "./const"
import { saveRegister } from "./save-register"

export function saveCache(cache: Cache, config: Config) {
  fse.writeJsonSync(CACHE_FILE, cache, { spaces: 2 })

  saveRegister(cache, config)
}
