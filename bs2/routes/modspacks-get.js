const muth = require('../util/data')
module.exports = {
    //Gets modpacks
	type: 'get',
    route: '/modpacks',
	exec: (req, res) => {
        res.status(200).send(Object.keys(muth.allMods))
	}
	
}
