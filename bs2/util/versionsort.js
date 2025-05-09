const versionTypePriority = { release: 3, beta: 2, alpha: 1 }
module.exports = (a, b) => { //sortModpacks
    // Helper function to compare semantic version numbers
	const compareVersionNumbers = (v1, v2) => {
		const partsA = v1.split('.').map(Number)
        
		const partsB = v2.split('.').map(Number)
		for (let i = 0; i < Math.max(partsA.length, partsB.length); i++) {
			const numA = partsA[i] || 0
			const numB = partsB[i] || 0
			if (numA !== numB) return numA - numB
		}
		return 0
	}

	// 1. "latest" status comes first
	if (a.status === 'latest' && b.status !== 'latest') return -1
	if (b.status === 'latest' && a.status !== 'latest') return 1

	// 2. Sort by version type (release > beta > alpha)
	const typeA = versionTypePriority[a.version_type] || 0
	const typeB = versionTypePriority[b.version_type] || 0
	if (typeA !== typeB) return typeB - typeA

	// 3. Sort by version number (descending)
	return compareVersionNumbers(b.version_number, a.version_number)
}

