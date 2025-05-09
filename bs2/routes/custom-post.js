const muth = require('../util/data')
module.exports = {
	//Adds custom mod
	type: 'post',
	route: '/custom',
	exec: (req, res) => {
		const { mod, username } = req.body

		if (!muth.currentModpack) {
			return res.status(500).send('No modpack selected.')
		}

		if (mod) {
			muth.mods.set(`$custom${++muth.lastId}`, { mod, username, state: '?', custom: true })
			muth.saveMods()
			res.status(200).send(`Custom mod added: ${mod}`)
		} else {
			res.status(400).send('No valid mod provided.')
		}
	}
}
