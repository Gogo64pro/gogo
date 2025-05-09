module.exports = function shortJSONStringify(obj) {
	return JSON.stringify(obj, (key, value) => value, 2).replace(/\[\s+([^\[\]]+?)\s+\]/g, (match, contents) => {
		const elements = contents.split(/\s*,\s*/)
		if (elements.length > 8) {
			return `[${elements.join(', ')}]`
		}
		return match
	})
}
