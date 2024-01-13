import fse from "fs-extra"
import sharp from "sharp"

import type { Cache, Queue } from "./types"
import { log } from "console"
import { LOG_TYPE } from "./const"

let isProcessingQueue = false

export async function processQueue(queue: Queue, cache: Cache) {
  if (isProcessingQueue) return

  if (queue.length <= 0) {
    isProcessingQueue = false
    log(LOG_TYPE.message, "Queue complete")
  }

  log(LOG_TYPE.message, "Queue started")
  isProcessingQueue = true

  let outputs: Promise<unknown>[] = []

  for (let item of queue) {
    if (!fse.existsSync(item.output)) {
      fse.mkdirSync(item.output, { recursive: true })
    }

    const image = sharp(item.path).resize({ width: item.width })

    item.outputTypes.forEach((type) => {
      const newImagePath = `${item.output}${item.filename}.`

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

      const path = newImagePath + type

      outputs.push(image.toFile(path))
      cache[item.path].generatedFiles.push(path)

      log(LOG_TYPE.write, path)
    })
  }

  return Promise.all(outputs)
}
