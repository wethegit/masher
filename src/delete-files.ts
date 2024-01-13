import fse from "fs-extra"

import { removeFromQueue } from "./remove-from-queue"
import type { Cache, Config, Queue } from "./types"
import { log } from "./log"
import { LOG_TYPE } from "./const"
import { saveCache } from "./save-cache"

export function deleteFiles(path: string, queue: Queue, cache: Cache, config: Config) {
  if (cache[path]) {
    // remove tasks related to this path from the queue
    removeFromQueue(path, queue)

    const filesToDelete = cache[path]?.generatedFiles || []

    filesToDelete.forEach((d) => {
      fse.remove(d)
      log(LOG_TYPE.deleted, d)
    })

    delete cache[path]

    saveCache(cache, config)
  }
}
