import { rmdirSync } from "node:fs"

import watch from "node-watch"

import { ACTION_TYPE, LOG_TYPE, QUEUE } from "./const.js"
import { checkAll } from "./check-all.js"
import { getProcessArguments } from "./get-process-arguments.js"
import { saveCache } from "./save-cache.js"
import { loadCache } from "./load-cache.js"
import { processPath } from "./process-path.js"
import { buildAndParseConfig } from "./build-and-parse-config.js"
import { ensureCwd } from "./ensure-cwd.js"
import { log } from "./log.js"
import { saveRegister } from "./save-register.js"
import { processQueue } from "./process-queue.js"

const root = await ensureCwd()

const args = getProcessArguments(process.argv.slice(2))

if (args.help) {
  console.log(`
    Usage
      $ @wethegit/masher [options]

    Options
      --clear, -c     Clear the cache and output
      --watch, -w     Watch for changes
      --force, -f     Force compression even if cached
      --help, -h      Show this help
  `)
  process.exit(0)
}

const config = await buildAndParseConfig(root)

const cache = loadCache(config)

if (args.clear) {
  try {
    rmdirSync(config.outputPath)
    saveCache({}, config)
  } catch (_) {}
}

checkAll(cache, config)

if (QUEUE.length === 0 && !args.watch) {
  log(LOG_TYPE.message, "Nothing to mash.")

  if (args.force) saveRegister(cache, config)

  process.exit(0)
}

await processQueue(cache)

saveCache(cache, config)

if (args.watch) {
  watch(config.inputPath, { recursive: true }, function (evt: string, name: string) {
    if (QUEUE && !QUEUE.length) {
      /*
        if we're not currently processing anything in the
        queue we should load a fresh version of the cache.
        This helps in scenarios like if the masher is running
        while changing to a much older/newer branch
      */

      loadCache(config)
    }

    const path = name

    if (evt === "remove") {
      processPath(path, ACTION_TYPE.delete, config, cache)
      saveCache(cache, config)
    } else {
      processPath(path, ACTION_TYPE.compress, config, cache)
      processQueue(cache)
      saveCache(cache, config)
    }
  })
}
