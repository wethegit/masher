import type { Config, OutputTypes } from "./types"

export function isValidFileType(type: string, { validTypes }: Config) {
  const ext = type.split(".").pop() as OutputTypes

  if (!ext) return false

  return validTypes.includes(ext)
}
