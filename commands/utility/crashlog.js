async function crashlog(message) {
    await message.reply({ files: ['./info/crash logs/error.txt'] })
}

module.exports = crashlog

//wow this is small