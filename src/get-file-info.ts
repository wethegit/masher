import { parse } from "node:path"

import sizeOf from "image-size"

import type { OutputTypes } from "./types"
import { LOG_TYPE } from "./const"
import { log } from "./log"

export interface FileInfo {
  path: string
  originalPath: string
  filename: string
  ext: OutputTypes
  width: number
  height: number
  is2x: boolean
  ratio: number
}

export function getFileInfo(path: string): FileInfo | null {
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

  const { name, dir } = parse(path)

  const is2x = path.includes("-x2") || path.includes("-2x") || path.includes("@2x")

  const filename = name.replace("-2x", "")

  const ratio = width / height

  const originalPath = `${dir}/${name}.${type}`

  return {
    path: dir,
    originalPath,
    filename,
    ext: type,
    width,
    height,
    is2x,
    ratio,
  }
}
