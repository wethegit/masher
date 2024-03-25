export interface Size {
  w: number
  h: number
}

export interface CacheItem {
  hash: string
  filename: string
  relativePath: string
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
  relativePath: string
  filename: string
  width: number
  height?: number
  outputTypes: OutputTypes[]
}

export type Queue = QueueItem[]

export interface Arguments {
  watch: boolean
  clear: boolean
  force: boolean
  help: boolean
}

export interface RegisterItem {
  e: OutputTypes[]
  b?: string[]
  s?: Partial<Record<string, Size>>
  w: number
  h: number
}

export type Register = Record<string, RegisterItem>
