const muth = require('../util/data')
module.exports = {
	//Changes state of a mod
	type: 'post',
	route: '/statechange',
	exec: (req, res) => {
		const { slug, state } = req.body
		if (!muth.currentModpack) {
			return res.status(500).send('No modpack selected.')
		}
		if (muth.mods.has(slug)) {
			const existingMod = muth.mods.get(slug)
			muth.mods.set(slug, { ...existingMod, state })
			muth.saveMods()
			res.status(200).send(`State updated for: ${slug}`)
		} else {
			res.status(404).send(`No mod found with slug: ${slug}`)
		}
	}
}
