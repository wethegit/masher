import { join, resolve, relative } from "node:path"

import type { Cache, CacheItem, Config, OutputTypes } from "./types"
import { FileInfo } from "./get-file-info"
import { addToQueue } from "./add-to-queue"

export function processDefinedImage(
  hash: string,
  { ext, path, originalPath, is2x, filename, width, height }: FileInfo,
  cache: Cache,
  config: Config
) {
  const outputTypes: OutputTypes[] = [ext]
  const fullPath = originalPath

  const rel = relative(config.inputPath, path)
  const output = resolve(config.outputPath, rel)
  const relativePath = join(rel, `${filename}.${ext}`)

  if (ext === "png") outputTypes.push("webp")

  const cacheItem: CacheItem = {
    hash,
    filename: fullPath,
    size: { width: width, height: height },
    count: 0,
    is2x: is2x,
    types: outputTypes,
    generatedFiles: [],
    relativePath: relativePath,
  }

  const add = ({
    filename,
    width,
    height,
  }: {
    filename: string
    width: number
    height?: number
  }) => {
    cacheItem.count += outputTypes.length

    addToQueue({
      path: fullPath,
      relativePath,
      output,
      filename,
      width,
      height,
      outputTypes,
    })
  }

  add({ filename: filename + (is2x ? "-2x" : ""), width })

  if (is2x) add({ filename, width: Math.ceil(width / 2), height: Math.ceil(height / 2) })

  cache[fullPath] = cacheItem
}
