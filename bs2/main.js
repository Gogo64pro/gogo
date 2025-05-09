const express = require('express')
const cors = require('cors')
const fs = require('fs')
const { log, warn, error } = require('./util/logger')
const app = express()
const muth = require('./util/data')
const filePath = './modpacks.json'
log('Starting...')

function loadMods() {
	if (fs.existsSync(filePath)) {
		const fileData = fs.readFileSync(filePath, 'utf8')
		muth.allMods = JSON.parse(fileData)
	} else {
		warn('Mods file not found. Starting fresh.')
	}
}

app.use(cors())
app.use(express.json())

app.listen(3000, '0.0.0.0', () => {
	console.log('API listening on http://0.0.0.0:3000')
	log('API listening on http://0.0.0.0:3000')
	loadMods()
})
const routes = fs.readdirSync('./routes')
for (i of routes) {
	const { exec, type, route } = require('./routes/' + i)
	app[type](route, (req, res) => exec(req, res))
	log(`Initialized ${type.toUpperCase()}  ${route}`)
}

// app.post('/', (req, res) => {
// const { mod, username } = req.body
//
// if (!muth.currentModpack) {
// return res.status(500).send('No modpack selected.')
// }
//
// if (mod && mod.slug) {
// const sanitizedMod = {
// project_type: mod.project_type,
// slug: mod.slug,
// title: mod.title,
// description: mod.description,
// categories: mod.categories,
// versions: mod.versions.filter((version) => !/(pre|rc|w)/.test(version)),
// icon_url: mod.icon_url
// }
//
// muth.mods.set(mod.slug, { mod: sanitizedMod, username, state: '?' })
// saveMods()
// res.status(200).send(`Added: ${mod.slug}`)
// } else {
// res.status(400).send('No valid mod provided.')
// }
// })
//
// app.post('/custom', (req, res) => {
// const { mod, username } = req.body
//
// if (!muth.currentModpack) {
// return res.status(500).send('No modpack selected.')
// }
//
// if (mod) {
// muth.mods.set(`$custom${++muth.lastId}`, { mod, username, state: '?', custom: true })
// saveMods()
// res.status(200).send(`Custom mod added: ${mod}`)
// } else {
// res.status(400).send('No valid mod provided.')
// }
// })
//
// app.post('/statechange', (req, res) => {
// const { slug, state } = req.body
//
// if (!muth.currentModpack) {
// return res.status(500).send('No modpack selected.')
// }
//
// if (muth.mods.has(slug)) {
// const existingMod = muth.mods.get(slug)
// muth.mods.set(slug, { ...existingMod, state })
// saveMods()
// res.status(200).send(`State updated for: ${slug}`)
// } else {
// res.status(404).send(`No mod found with slug: ${slug}`)
// }
// })
//
// app.post('/modpack', (req, res) => {
// const { modpack } = req.body
//
// if (modpack) {
// muth.currentModpack = modpack
// muth.mods = new Map(Object.entries(muth.allMods?.[modpack]?.muth.mods || {}))
// muth.lastId = muth.allMods?.[modpack]?.muth.lastId || 0
// res.status(200).send(`Current modpack set to: ${modpack}`)
// } else {
// res.status(400).send('Invalid modpack provided.')
// }
// })
//
// app.get('/', (req, res) => {
// res.status(200).send(Array.from(muth.mods.values()))
// })
//
// app.get('/modpacks', (req, res) => {
// res.status(200).send(Object.keys(muth.allMods))
// })
