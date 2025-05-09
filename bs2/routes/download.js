const {download} = require('../download')
const muth = require('../util/data')
const logger = require('../util/logger')
module.exports = {
	//Downloads all mods
	type: 'post',
	route: '/download',
	exec: async (req, res) => {
		const axios = require('axios')
		if (!muth.currentModpack) {
			res.status(500).send('No modpack selected.')
			return
		}

		if (!muth.serverLoader || !muth.serverVersion) {
			res.status(500).send('No server version/loader selected')
			return
		}

		let downErr = false

		const downloadMod = async (mod2) => {
            if(mod2.state !== 'Approved') return
            var mod = mod2.mod
			try {
				logger.log(`Downloading: ${mod.slug}`)

				// Add a timeout (e.g., 30 seconds)
				const controller = new AbortController()
				const timeout = setTimeout(() => controller.abort(), 30000)

				await download(mod.slug, { signal: controller.signal })

				clearTimeout(timeout)
				logger.log(`Finished: ${mod.slug}`)
			} catch (error) {
				if (error.message.includes('timeout') || error.name === 'AbortError') {
					logger.error(`Timeout when downloading mod ${mod.slug}`)
				} else if (error.message.includes('Error when downloading')) {
					logger.error(`Error when downloading mod ${mod.slug}`)
				}else logger.error(error.message)
				downErr = true
			}
		}

		// Run downloads **in parallel** with timeout handling
		await Promise.allSettled(Array.from(muth.mods.values()).map(downloadMod))

		if (downErr) {
			res.status(500).send('Internal error when downloading one or more mods')
		} else {
			res.status(200).send('All mods downloaded successfully')
		}
	}
}
