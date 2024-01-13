import fse from "fs-extra"
import watch from "node-watch"

import config from "./mash.config.js"

import { FOLDERS, ACTION_TYPE, LOG_TYPE } from "./const.js"

import { log } from "./log.js"
import { getProcessArguments } from "./get-process-arguments.js"
import { Cache, Queue } from "./types.js"
import { saveCache } from "./save-cache.js"
import { loadCache } from "./load-cache.js"
import { checkAll } from "./check-all.js"
import { processPath } from "./process-path.js"

const args = getProcessArguments(process.argv.slice(2))

let cache: Cache = {}
let queue: Queue = []

if (args.clearAllOuput) {
  try {
    fse.rmSync(FOLDERS.output, { recursive: true })
    saveCache(cache, config)
    log(LOG_TYPE.message, `${FOLDERS.output} is deleted!`)
  } catch (err) {
    log(LOG_TYPE.error, `Error while deleting ${FOLDERS.output}.`)
  }
}

loadCache(config)
checkAll(cache, config, queue, args)

if (args.watching) {
  watch(FOLDERS.input, { recursive: true }, function (evt: string, name: string) {
    if (queue && !queue.length) {
      /*
        if we're not currently processing anything in the
        queue we should load a fresh version of the cache.
        This helps in scenarios like if the masher is running
        while changing to a much older/newer branch
      */

      loadCache(config)
    }

    if (evt === "remove") {
      processPath("./" + name, ACTION_TYPE.delete, config, cache, queue)
    } else {
      processPath("./" + name, ACTION_TYPE.compress, config, cache, queue)
    }
  })
}
