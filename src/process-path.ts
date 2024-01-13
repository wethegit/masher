import md5File from "md5-file"

import type { Cache, Config, Queue } from "./types"
import { ACTION_TYPE, FOLDERS, LOG_TYPE, PROCESS_TYPE } from "./const"
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
  cache: Cache,
  queue: Queue
) {
  const processType = path
    .replace(FOLDERS.input, "")
    ?.split("/")
    ?.shift()
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
      const isDirectory = !path.slice(1, -1).includes(".")

      if (isDirectory) {
        // a directory was deleted so we need to make a list of
        // files from the cache that were in that folder
        Object.keys(cache)
          .filter((p) => p.includes(path))
          .forEach((p) => deleteFiles(p, queue, cache, config))
      } else {
        if (cache[path]) {
          deleteFiles(path, queue, cache, config)
        } else {
          log(LOG_TYPE.message, `file ${path} was removed but not found in cache`)
        }
      }
      break
    case ACTION_TYPE.compress:
      const fileInfo = getFileInfo(path, processType)

      if (fileInfo) {
        const hash = md5File.sync(path)
        if (hasFileChanged(cache, path, hash)) {
          log(LOG_TYPE.read, path)
          switch (processType) {
            case PROCESS_TYPE.defined:
              processDefinedImage(path, hash, fileInfo, queue, cache, config)
              break
            case PROCESS_TYPE.auto:
              processAutoImage(path, hash, fileInfo, queue, cache, config)
              break
          }
        } else {
          // log(LOG_TYPE.message, `file hasn't changed since last ${action}`)
        }
      }
      break
    default:
      log(LOG_TYPE.error, `No process for action: ${action}`)
  }
}
