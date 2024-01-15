export interface CacheItem {
  hash: string
  filename: string
  size: {
    width: number
    height: number
  }
  count: number
  is2x?: boolean
  types: OutputTypes[]
  generatedFiles: string[]
}

export interface Cache extends Record<string, CacheItem> {}

export type OutputTypes = "png" | "jpg" | "jpeg" | "webp" | "avif"

export interface Config {
  useImageRegister: boolean
  validTypes: OutputTypes[]
  outputPath: string
  inputPath: string
  breakpoints: string[]
}

export interface QueueItem {
  path: string
  output: string
  filename: string
  width: number
  height?: number
  outputTypes: OutputTypes[]
}

export type Queue = QueueItem[]

export interface Arguments {
  watching: boolean
  clearAllOuput: boolean
  forceRegisterRewrite: boolean
  prettyRegister: boolean
}
