import md5File from "md5-file"

import type { Cache, Config } from "./types"
import { ACTION_TYPE, LOG_TYPE, PROCESS_TYPE } from "./const"
import { deleteFiles } from "./delete-files"
import { getFileInfo } from "./get-file-info"
import { hasFileChanged } from "./has-file-changed"
import { isValidFileType } from "./is-valid-file-type"
import { log } from "./log"
import { processDefinedImage } from "./process-defined-image"
import { processAutoImage } from "./process-auto-image"

export function processPath(
  path: string,
  action: ACTION_TYPE,
  config: Config,
  cache: Cache
) {
  const processType = path
    .replace(config.inputPath, "")
    ?.split("/")[1]
    ?.trim() as PROCESS_TYPE

  if (!processType) return

  const validProcessTypes = Object.keys(PROCESS_TYPE)

  if (validProcessTypes.indexOf(processType) === -1) {
    log(
      LOG_TYPE.error,
      `No process to handle items in the '${processType}' folder`,
      `valid folders are ${validProcessTypes.map((d) => `'${d}'`).join(", ")}`
    )
    return
  }

  if (!isValidFileType(path, config) && action === ACTION_TYPE.compress) {
    if (!path.includes(".DS_Store")) log(LOG_TYPE.error, `Invalid file type`, path)
    return
  }

  switch (action) {
    case ACTION_TYPE.delete:
      console.log("del", path, path.split("/").at(-1))
      const isDirectory = !path.slice(1, -1).includes(".")

      if (isDirectory) {
        // a directory was deleted so we need to make a list of
        // files from the cache that were in that folder
        Object.keys(cache)
          .filter((p) => p.includes(path))
          .forEach((p) => deleteFiles(p, cache))
      } else {
        if (cache[path]) {
          deleteFiles(path, cache)
        } else {
          log(LOG_TYPE.message, `file ${path} was removed but not found in cache`)
        }
      }
      break
    case ACTION_TYPE.compress:
      const fileInfo = getFileInfo(path)

      if (fileInfo) {
        const hash = md5File.sync(path)

        if (hasFileChanged(cache, path, hash)) {
          console.log("changed", path, processType)
          switch (processType) {
            case PROCESS_TYPE.defined:
              processDefinedImage(hash, fileInfo, cache, config)
              break
            case PROCESS_TYPE.auto:
              processAutoImage(hash, fileInfo, cache, config)
              break
          }
        }
      }
      break
    default:
      log(LOG_TYPE.error, `No process for action: ${action}`)
  }
}
