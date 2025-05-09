const muth = require('../util/data')
module.exports = {
    //Gets mods
	type: 'get',
    route: '/',
	exec: (req, res) => {
        res.status(200).send(Array.from(muth.mods.values()))
	}
	
}
