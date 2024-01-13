import path from "node:path"
import glob from "glob"

import type { Arguments, Cache, Config, Queue } from "./types"
import { ACTION_TYPE, FOLDERS, LOG_TYPE } from "./const"
import { processPath } from "./process-path"
import { log } from "./log"
import { saveRegister } from "./save-register"

export function checkAll(
  cache: Cache,
  config: Config,
  queue: Queue,
  { watching, forceRegisterRewrite, prettyRegister }: Arguments
) {
  const files = glob.sync(path.join(FOLDERS.input, "**/*.*"))

  // check for files deleted while masher wasn't running

  Object.keys(cache).forEach((cacheFile) => {
    if (!files.includes(cacheFile)) {
      processPath(cacheFile, ACTION_TYPE.delete, config, cache, queue)
    }
  })

  // check for files added while masher wasn't running

  for (let i = 0; i < files.length; i++) {
    const path = files[i]

    processPath(path, ACTION_TYPE.compress, config, cache, queue)
  }

  if (queue.length === 0 && !watching) {
    log(LOG_TYPE.message, "Nothing to mash.")

    if (forceRegisterRewrite) saveRegister(cache, config, prettyRegister)
  }
}
