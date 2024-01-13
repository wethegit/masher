import fse from "fs-extra"
import { CACHE_FILE, CACHE_NAME, LOG_TYPE } from "./const"

import type { Cache, Config } from "./types"
import { saveCache } from "./save-cache"
import { log } from "./log"

export function loadCache(config: Config): Cache {
  let cache: Cache = {}

  try {
    cache = fse.readJsonSync(CACHE_FILE)

    log(LOG_TYPE.message, `${CACHE_NAME} loaded`)
  } catch (err) {
    log(LOG_TYPE.message, `No ${CACHE_NAME} found. Creating a new one...`)

    saveCache(cache, config)
  }

  return cache
}
