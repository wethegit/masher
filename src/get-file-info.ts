import sizeOf from "image-size"

import type { OutputTypes } from "./types"
import { FOLDERS, LOG_TYPE, PROCESS_TYPE } from "./const"
import { log } from "./log"

export interface FileInfo {
  path: string
  filename: string
  ext: OutputTypes
  width: number
  height: number
  is2x: boolean
  ratio: number
}

export function getFileInfo(path: string, processType: PROCESS_TYPE): FileInfo | null {
  let width = null
  let height = null
  let type: OutputTypes | null = null

  try {
    const size = sizeOf(path)

    width = size.width!
    height = size.height!
    type = size.type as OutputTypes
  } catch (err) {
    log(LOG_TYPE.error, "Could not load file", path)

    return null
  }

  const is2x = path.includes("-x2") || path.includes("-2x") || path.includes("@2x")
  const split = path.replace(FOLDERS.input + processType + "/", "").split("/")
  const filename = split?.pop()?.split(".")[0].replace("-2x", "")!
  const newPath = split.join("/") + "/"
  const ratio = width / height

  return {
    path: newPath,
    filename,
    ext: type,
    width,
    height,
    is2x,
    ratio,
  }
}
