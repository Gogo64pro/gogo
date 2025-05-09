const muth = require('../util/data')
module.exports = {
	//Sets to a modpack
	type: 'post',
	route: '/modpack',
	exec: (req, res) => {
		const { modpack } = req.body

		if (modpack) {
			const modpackData = muth.allMods[modpack]
			muth.currentModpack = modpack
			muth.mods = new Map(Object.entries(modpackData?.mods || {}))
			muth.lastId = modpackData?.lastId || 0
			res.status(200).send(`Current modpack set to: ${modpack}`)
		} else {
			res.status(400).send('Invalid modpack provided')
		}
	}
}
