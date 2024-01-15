import type { Config, Queue } from "./types"

export const QUEUE: Queue = []

export enum ACTION_TYPE {
  delete = "delete",
  compress = "compress",
}

export enum LOG_TYPE {
  read = "read",
  write = "write",
  error = "error",
  message = "msg",
  deleted = "deleted",
}

export const DEFAULT_CONFIG_VALUES: Config = {
  useImageRegister: true,
  validTypes: ["png", "webp", "jpg", "jpeg"],
  outputPath: "public/_images/",
  inputPath: "src/images/",
  breakpoints: ["xxlarge-up", "xlarge-up", "large-up", "medium-up"],
}

export const MASH_NAME = "masher"

export const CACHE_NAME = "MashCache"

export const CACHE_FILE = "./mash.cache.json"

export const IMAGES_REGISTER_FILE = "./images_register.json"

export const DEFAULT_CONFIG_FILE_NAME = "masher.config.json"
