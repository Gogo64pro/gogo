const {log,warn,error} = require('./logger')
const fs = require('fs')
const filePath = './modpacks.json'
const shortJSONStringify = require('./shortjsonstringify')
module.exports = {
	currentModpack: null,
	mods: new Map(),
	allMods: {},
	lastId: 0,
    serverVersion: '1.20.1',
    serverLoader: 'all',
    forceServerParams: false,
	saveMods: () => {
        const self = module.exports
		if (self.currentModpack) {
			self.allMods[self.currentModpack] = { mods: Object.fromEntries(self.mods), lastId: self.lastId, serverLoader:self.serverLoader, serverVersion: self.serverVersion }
			fs.writeFileSync(filePath, shortJSONStringify(self.allMods))
		} else {
			warn('No modpack selected, Save skipped')
		}
	},
    modpackFolder: './modpacks'
}

//update moddata