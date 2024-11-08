export {}

const abiVersionBun = process.versions.modules
const abiVersionNode = (await Bun.$`node -p 'process.versions.modules'`.quiet())
  .text()
  .replace(/\n$/, "")

const platform = process.platform
const arch = process.arch

const libcVersionTarget = "2.29"
const libcVersionCurrent = (await Bun.$`ldd --version`.text())
  .match(/\d+\.\d+(?:\.\d+)?/)![0]
  .replace(/\.(\d)$/, "$1")

const basePath = `./node_modules/@discordjs/opus/prebuild`

const oldPath = `./node-v${abiVersionNode}-napi-v3-${platform}-${arch}-glibc-${libcVersionCurrent}`
const newPath = `./node-v${abiVersionBun}-napi-v3-${platform}-${arch}-glibc-${libcVersionTarget}`

await Bun.$.cwd(basePath)`cp -r ${oldPath} ${newPath}`
