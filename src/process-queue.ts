import { join } from "node:path"
import { log } from "console"

import fse from "fs-extra"
import sharp from "sharp"

import type { Cache } from "./types"
import { CACHE_NAME, LOG_TYPE, QUEUE } from "./const"

let isProcessingQueue = false

export async function processQueue(cache: Cache) {
  if (isProcessingQueue) return

  log(LOG_TYPE.message, `${CACHE_NAME} Queue started`)
  isProcessingQueue = true

  const outputs: Promise<unknown>[] = []

  for (let i = QUEUE.length - 1; i >= 0; i--) {
    const item = QUEUE.pop()

    if (!item) continue

    console.log({ output: item.output, path: item.path })

    if (!fse.existsSync(item.output)) {
      fse.mkdirSync(item.output, { recursive: true })
    }

    const image = sharp(item.path).resize({ width: item.width })

    item.outputTypes.forEach((type) => {
      const newImagePath = join(item.output, item.filename)

      switch (type) {
        case "png":
          // png options
          // https://sharp.pixelplumbing.com/api-output#png
          image.clone().png()
          break
        case "jpg":
        case "jpeg":
          // jpeg options
          // https://sharp.pixelplumbing.com/api-output#jpeg
          image.clone().jpeg()
          break
        case "webp":
          // webp options
          // https://sharp.pixelplumbing.com/api-output#webp
          image.clone().webp({ nearLossless: true })
          break
        case "avif":
          // avif options
          // https://sharp.pixelplumbing.com/api-output#avif
          image.clone().avif()
          break
      }

      const path = newImagePath + "." + type

      outputs.push(image.toFile(path))
      cache[item.path].generatedFiles.push(path)

      log(LOG_TYPE.write, path)
    })
  }

  return Promise.all(outputs).then(() => {
    isProcessingQueue = false
    log(LOG_TYPE.message, `${CACHE_NAME} Queue complete`)
  })
}
