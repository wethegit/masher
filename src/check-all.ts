import { join } from "node:path"

import { glob } from "glob"

import type { Cache, Config } from "./types"
import { ACTION_TYPE } from "./const"
import { processPath } from "./process-path"

export function checkAll(cache: Cache, config: Config) {
  const files = glob.sync(join(config.inputPath, "**/*.*"))

  // check for files deleted while masher wasn't running
  Object.keys(cache).forEach((cacheFile) => {
    if (!files.includes(cacheFile)) {
      processPath(cacheFile, ACTION_TYPE.delete, config, cache)
    }
  })

  // check for files added while masher wasn't running
  for (const path of files) {
    processPath(path, ACTION_TYPE.compress, config, cache)
  }
}
