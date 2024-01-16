import { join, resolve, relative } from "node:path"

import type { Cache, CacheItem, Config, OutputTypes } from "./types"
import { FileInfo } from "./get-file-info"
import { addToQueue } from "./add-to-queue"

export function processDefinedImage(
  hash: string,
  { ext, path, is2x, filename, width, height }: FileInfo,
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
    is2x: is2x,
    types: outputTypes,
    generatedFiles: [],
  }

  const add = (filename: string, width: number, height?: number) => {
    cacheItem.count += outputTypes.length

    const rel = relative(config.inputPath, path)

    addToQueue({
      path: fullPath,
      output: resolve(config.outputPath, rel),
      filename,
      width,
      height,
      outputTypes,
    })
  }

  add(filename + (is2x ? "-2x" : ""), width)

  if (is2x) add(filename, Math.ceil(width / 2), Math.ceil(height / 2))

  cache[fullPath] = cacheItem
}
