const axios = require('axios')
const data = require('./util/data')
const { log, warn, error } = require('./util/logger')
const versionsort = require('./util/versionsort')
const api = 'https://api.modrinth.com/v2/'
const fs = require('fs')
const fsp = require('fs/promises')
const path = require('path')
const crypto = require('crypto')
module.exports = {
	download: async (slug) => {
		if (data.serverLoader == '' || data.serverVersion == '') {
			error('No loader or version set')
			throw new Error('No loader or version set')
		}
		const params = {
			game_versions: `["${data.serverVersion}"]`
		}

		if (data.serverLoader !== 'all') {
			params.loaders = `["${data.serverLoader}"]`
		}

		const versionsres = await axios.get(`${api}project/${slug}/version`, {
			params,
			validateStatus: () => true
		})
		if (versionsres.status != 200) {
			error(`Error when downloading, recieved status code ${versionsres.status} when downloading ${slug}`)
			throw new Error('Error when downloading')
		}
		if (versionsres.data == []) {
			error(`Got empty array response`)
			throw new Error('Got empty array response')
		}
		versionsres.data.sort(versionsort)
		const files = versionsres.data[0].files
		files.forEach(downloadfile)
	}
}
async function downloadfile(modrinthfile) {
	//Stores file in Memory DO NOT USE
	//const filedata = await axios.get(modrinthfile.url)
	//fs.writeFile(`${data.modpackFolder}/${data.currentModpack}/`,filedata)
	if (!modrinthfile.primary) return
	const filePath = path.join(data.modpackFolder, data.currentModpack, modrinthfile.filename)

	if (!fs.existsSync(path.dirname(filePath))) await fsp.mkdir(path.dirname(filePath), { recursive: true })
	if (!fs.existsSync(path)) await fsp.writeFile(filePath, '', { flag: 'wx' })

	const writer = fs.createWriteStream(filePath)
	const hashStream = crypto.createHash('sha1')

	const response = await axios({
		method: 'get',
		url: modrinthfile.url,
		responseType: 'stream'
	})

	response.data.on('data', (chunk) => hashStream.update(chunk))
	response.data.pipe(writer)

	await new Promise((resolve, reject) => {
		writer.on('finish', () => {
			if (modrinthfile.hashes.sha1 == hashStream.digest('hex')) 
            resolve()
        else{
            error('Got an mismatched hash')
        }
		})
		writer.on('error', reject)
	})
}
