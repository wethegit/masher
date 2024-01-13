import { Arguments } from "./types"

export function getProcessArguments(args: string[]): Arguments {
  const watching = args.includes("--watch")
  const clearAllOuput = args.includes("--force-remash")
  const forceRegisterRewrite = args.includes("--force-register")
  const prettyRegister = args.includes("--pretty-register")

  return {
    watching,
    clearAllOuput,
    forceRegisterRewrite,
    prettyRegister,
  }
}
