/**
 * temporary workaround for `@discordjs/opus`: can't build with bun, falls
 * back to node. results in bot failing to find opus bindings with bun due to
 * incorrect path.
 */

import * as fs from "node:fs"
import * as path from "node:path"

await (async function main() {
  const modulePath = getModulePath()
  const prebuildPath = path.join(modulePath, "prebuild")

  // runs the `@discordjs/opus` postinstall script
  await Bun.$.cwd(modulePath)`bun run install`

  const abiVerOld = await getAbiVersion("node")
  const abiVerNew = await getAbiVersion("bun")

  const libcVerOld = await getLibcVersion("node")
  const libcVerNew = await getLibcVersion("bun")

  const oldPath = getBindingsPath(prebuildPath, abiVerOld, libcVerOld)
  const newPath = getBindingsPath(prebuildPath, abiVerNew, libcVerNew)

  // checks if old path exists
  if (!fs.existsSync(oldPath)) {
    throw new Error(`No prebuild bindings found at '${oldPath}'`)
  }

  // checks if old path is same as new path
  if (oldPath === newPath) {
    console.log("No need to rename prebuild bindings")
    return
  }

  // copies the prebuild bindings to the new path
  fs.cpSync(oldPath, newPath, { recursive: true })
})()

// returns the abi version for the specified target
async function getAbiVersion(target: "node" | "bun") {
  if (target === "bun") return process.versions.modules
  return (await Bun.$`node -p 'process.versions.modules'`.quiet())
    .text()
    .replace(/\n$/, "")
}

// returns the libc version for the specified target
async function getLibcVersion(target: "node" | "bun") {
  if (process.platform === "win32") return "unknown"
  if (target === "bun") return "2.29"
  return /\d+\.\d+(?:\.\d+)?/.exec(await Bun.$`ldd --version`.text())![0]
}

// returns the module root path
function getModulePath() {
  const cwdPath = process.cwd()
  const moduleEntryPath = Bun.resolveSync("@discordjs/opus", cwdPath)
  const moduleRootPath = path.join(moduleEntryPath, "..", "..")
  return moduleRootPath
}

// returns the path to the prebuild bindings
function getBindingsPath(basePath: string, abiVer: string, libcVer: string) {
  const platform = process.platform
  const arch = process.arch
  const libc = platform === "win32" ? "unknown" : "glibc"

  return path.join(
    basePath,
    `./node-v${abiVer}-napi-v3-${platform}-${arch}-${libc}-${libcVer}`,
  )
}
