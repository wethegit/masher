import path from "node:path"

import type { Cache, Config, OutputTypes, Queue } from "./types"
import { FileInfo } from "./get-file-info"
import { FOLDERS, PROCESS_TYPE } from "./const"
import { addToQueue } from "./add-to-queue"
import { saveCache } from "./save-cache"

export function processDefinedImage(
  filePath: string,
  hash: string,
  fileInfo: FileInfo,
  queue: Queue,
  cache: Cache,
  config: Config
) {
  const outputTypes: OutputTypes[] = [fileInfo.ext]

  if (fileInfo.ext === "png") outputTypes.push("webp")

  cache[filePath] = {
    hash,
    filename: path.join(fileInfo.path, fileInfo.filename + "." + outputTypes[0]),
    size: { width: fileInfo.width, height: fileInfo.height },
    count: 0,
    is2x: fileInfo.is2x,
    process: PROCESS_TYPE.defined,
    types: outputTypes,
    generatedFiles: [],
  }

  const add = (filename: string, width: number, height?: number) => {
    cache[filePath].count += outputTypes.length

    addToQueue(
      {
        path: filePath,
        output: path.join(FOLDERS.output, fileInfo.path),
        filename,
        width,
        height,
        outputTypes,
      },
      queue
    )
  }

  add(fileInfo.filename + (fileInfo.is2x ? "-2x" : ""), fileInfo.width)

  if (fileInfo.is2x)
    add(fileInfo.filename, Math.ceil(fileInfo.width / 2), Math.ceil(fileInfo.height / 2))

  saveCache(cache, config)
}
