import { join, relative, resolve } from "node:path"

import type { Cache, CacheItem, Config, OutputTypes } from "./types"
import { FileInfo } from "./get-file-info"
import { PROCESS_TYPE } from "./const"
import { addToQueue } from "./add-to-queue"

export function processAutoImage(
  hash: string,
  { ext, path, filename, width, height }: FileInfo,
  cache: Cache,
  config: Config
) {
  const outputTypes: OutputTypes[] = [ext]
  const fullPath = join(path, filename + "." + ext)

  if (ext === "png") outputTypes.push("webp")

  const cacheItem: CacheItem = {
    hash,
    filename: fullPath,
    size: { width: width, height: height },
    count: 0,
    process: PROCESS_TYPE.auto,
    types: outputTypes,
    generatedFiles: [],
  }

  const targetWidth = width
  const sizes = []

  for (
    let size = config.imageSizeStepAmount;
    size <= targetWidth;
    size += config.imageSizeStepAmount
  )
    sizes.push(size)

  if (sizes[sizes.length - 1] !== targetWidth) sizes.push(targetWidth)

  for (const size of sizes) {
    const stepName = size === config.imageSizeStepAmount ? "" : `-${size}`

    cacheItem.count += outputTypes.length

    const rel = relative(PROCESS_TYPE.defined, relative(config.inputPath, path))

    addToQueue({
      path: fullPath,
      output: resolve(config.outputPath, rel),
      filename: filename + stepName,
      width: size,
      outputTypes,
    })
  }

  cache[fullPath] = cacheItem
}
