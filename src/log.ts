import chalk, { Chalk } from "chalk"

import { LOG_TYPE, MASH_NAME } from "./const"

export function log(type: LOG_TYPE, message: string, extra?: string) {
  const colorMap: Record<LOG_TYPE, Chalk> = {
    [LOG_TYPE.read]: chalk.blue,
    [LOG_TYPE.write]: chalk.green,
    [LOG_TYPE.error]: chalk.red,
    [LOG_TYPE.deleted]: chalk.magenta,
    [LOG_TYPE.message]: chalk.dim,
  }

  let textLog: string = ""

  if (type !== LOG_TYPE.message) textLog = colorMap[type](type) + " "

  textLog += "- "

  if (type === LOG_TYPE.error) textLog += colorMap[type](message)
  else textLog += chalk.white(message)

  console.log(chalk.yellow(MASH_NAME), textLog)

  if (extra) console.log(`       ⨽ ${extra}`)
}
