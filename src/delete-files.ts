import { resolve } from "node:path"

import fse from "fs-extra"

import type { Cache } from "./types"
import { removeFromQueue } from "./remove-from-queue"
import { log } from "./log"
import { LOG_TYPE } from "./const"

export function deleteFiles(path: string, cache: Cache) {
  if (cache[path]) {
    // remove tasks related to this path from the queue
    removeFromQueue(path)

    const filesToDelete = cache[path]?.generatedFiles || []

    filesToDelete.forEach((d) => {
      d = resolve(d)
      fse.unlink(d)
      log(LOG_TYPE.deleted, d)
    })

    delete cache[path]
  }
}
