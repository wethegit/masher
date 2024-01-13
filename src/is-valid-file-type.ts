import type { Config, OutputTypes } from "./types"

export function isValidFileType(type: string, config: Config) {
  const ext = type.split(".").pop() as OutputTypes

  if (!ext) return false

  return config.validTypes.includes(ext)
}
