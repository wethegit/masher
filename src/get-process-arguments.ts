import { Arguments } from "./types"

export function getProcessArguments(args: string[]): Arguments {
  const watch = args.includes("--watch")
  const clear = args.includes("--clear")
  const force = args.includes("--force")
  const help = args.includes("--help")

  return {
    watch,
    clear,
    force,
    help,
  }
}
