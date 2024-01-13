export const BREAKPOINTS = ["xxlarge-up", "xlarge-up", "large-up", "medium-up"] as const

export const FOLDERS = {
  output: "public/_images/",
  input: "src/images/",
}

export enum PROCESS_TYPE {
  auto = "auto",
  defined = "defined",
}

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

export const MASH_NAME = "masher"

export const CACHE_NAME = "MashCache"

export const CACHE_FILE = "./mash.cache.json"

export const IMAGES_REGISTER_FILE = "./images_register.json"
