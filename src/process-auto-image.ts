import path from "node:path"

import type { Cache, Config, Queue } from "./types"
import { FileInfo } from "./get-file-info"
import { FOLDERS, PROCESS_TYPE } from "./const"
import { addToQueue } from "./add-to-queue"
import { processQueue } from "./process-queue"
import { saveCache } from "./save-cache"

export function processAutoImage(
  filePath: string,
  hash: string,
  fileInfo: FileInfo,
  queue: Queue,
  cache: Cache,
  config: Config
) {
  const outputTypes = [fileInfo.ext]
  if (fileInfo.ext === "png") outputTypes.push("webp")

  cache[filePath] = {
    hash,
    filename: path.join(fileInfo.path, fileInfo.filename + "." + outputTypes[0]),
    size: { width: fileInfo.width, height: fileInfo.height },
    count: 0,
    process: PROCESS_TYPE.auto,
    types: outputTypes,
    generatedFiles: [],
  }

  const targetWidth = fileInfo.width
  const sizes = []

  for (
    let size = config.imageSizeStepAmount;
    size <= targetWidth;
    size += config.imageSizeStepAmount
  ) {
    sizes.push(size)
  }

  if (sizes[sizes.length - 1] !== targetWidth) sizes.push(targetWidth)

  for (const size of sizes) {
    const stepName = size === config.imageSizeStepAmount ? "" : `-${size}`
    // const squooshImage = imagePool.ingestImage(image)
    // await squooshImage.decoded
    cache[filePath].count += outputTypes.length

    addToQueue(
      {
        path: filePath,
        output: path.join(FOLDERS.output, fileInfo.path),
        filename: fileInfo.filename + stepName,
        width: size,
        outputTypes,
      },
      queue
    )
  }

  processQueue(queue, cache)
  saveCache(cache, config)
}
