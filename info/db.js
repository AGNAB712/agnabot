const { QuickDB } = require("quick.db")
const fs = require('fs');
const path = require('path');
const os = require('os')

const dataDir =
  process.env.AGNABOT_DATA_DIR ??
  path.join(os.homedir(), ".local/share/agnabot")

fs.mkdirSync(dataDir, { recursive: true })

export const db = new QuickDB({
  filePath: path.join(dataDir, "json.sqlite")
})
