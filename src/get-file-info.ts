import { parse, relative } from "node:path"
import { cwd } from "node:process"

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

export function getFileInfo(PATH: string): FileInfo | null {
  let width = null
  let height = null
  let type: OutputTypes | null = null

  try {
    const size = sizeOf(PATH)

    width = size.width!
    height = size.height!
    type = size.type as OutputTypes
  } catch (err) {
    log(LOG_TYPE.error, "Could not load file", PATH)

    return null
  }

  const { name, dir } = parse(PATH)

  const is2x = PATH.includes("-x2") || PATH.includes("-2x") || PATH.includes("@2x")

  const filename = name.replace("-2x", "")

  const ratio = width / height

  // const originalPath = `${dir}/${name}.${type}`
  const originalPath = "./" + relative(cwd(), `${dir}/${name}.${type}`)

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
