exports.info = (msg) => console.log(`[INFO] ${new Date().toISOString()} - ${msg}`)
exports.error = (msg) => console.error(`[ERROR] ${new Date().toISOString()} - ${msg}`)