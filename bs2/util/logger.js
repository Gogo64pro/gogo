const fs = require('fs/promises')
module.exports = {
	log: async (data) => {
		const date = new Date()
		const dateformat = `${date.getMonth() + 1}/${date.getDate()}/${date.getFullYear()} -- ${date.getHours()}:${date.getMinutes()}:${date.getSeconds()}`
		await fs.appendFile('./log.log', `[${dateformat}][INFO]${data}\n`)
	},
	warn: async (data) => {
		const date = new Date()
		const dateformat = `${date.getMonth() + 1}/${date.getDate()}/${date.getFullYear()} -- ${date.getHours()}:${date.getMinutes()}:${date.getSeconds()}`
		await fs.appendFile('./log.log', `[${dateformat}][WARN]${data}\n`)
	},
	error: async (data) => {
		const date = new Date()
		const dateformat = `${date.getMonth() + 1}/${date.getDate()}/${date.getFullYear()} -- ${date.getHours()}:${date.getMinutes()}:${date.getSeconds()}`
		await fs.appendFile('./log.log', `[${dateformat}][ERROR]${data}\n`)
	}
}
