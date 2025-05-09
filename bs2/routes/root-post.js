const muth = require('../util/data')
module.exports = {
	//Add a mod
	type: 'post',
	route: '/',
	exec: (req, res) => {
		const { mod, username } = req.body

		if (!muth.currentModpack) {
			return res.status(500).send('No modpack selected.')
		}

		if (mod && mod.slug) {
			const sanitizedMod = {
				project_type: mod.project_type,
				slug: mod.slug,
				title: mod.title,
				description: mod.description,
				categories: mod.categories,
				versions: mod.versions.filter((version) => !/(pre|rc|w)/.test(version)),
				icon_url: mod.icon_url
			}

			muth.mods.set(mod.slug, { mod: sanitizedMod, username, state: '?' })
			muth.saveMods()
			res.status(200).send(`Added: ${mod.slug}`)
		} else {
			res.status(400).send('No valid mod provided.')
		}
	}
}
