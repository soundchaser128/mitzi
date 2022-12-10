import debug from "debug"

export default function createLogger(prefix: string) {
  return debug(`mitzi:${prefix}`)
}
