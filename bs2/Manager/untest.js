let server = 'http:localhost:3000'
let approved = {}
const modpackid = document.getElementById('modpackid')
let nextmaintimeout

modpackid.addEventListener('input', () => {
	if (modpackid.value.trim() == '') return
	const options = {
		method: 'POST',
		headers: { 'Content-Type': 'application/json' },
		body: JSON.stringify({ modpack: modpackid.value })
	}

	fetch(`${server}/modpack`, options).catch((err) => console.error(err))
	clearTimeout(nextmaintimeout)
	main()
})

async function RFS() {
	if (!server) {
		alert('No server = yes bitches')
		return
	}

	try {
		const response = await fetch(server, {
			method: 'GET',
			headers: {
				'Content-Type': 'application/json'
			},
			body: null
		})

		if (!response.ok) {
			throw new Error(`Request failed with status ${response.status}`)
		}

		return await response.text()
	} catch (error) {
		console.error('Error:', error.message)
		throw error
	}
}
function addItem(obj) {
	const { icon_url, title, description, slug, versions } = obj.mod
	const content = document.getElementById('content')
	const item = document.createElement('div')
	item.className = 'item'

	const img = document.createElement('img')
	img.src = icon_url
	img.alt = title

	const info = document.createElement('div')
	info.className = 'info'

	const itemTitle = document.createElement('a')
	itemTitle.textContent = title
	itemTitle.href = `https://modrinth.com/mod/${slug}`
	itemTitle.target = '_blank'
	itemTitle.rel = 'noopener noreferrer'
	if (obj.state == '?') {
		itemTitle.className = 'yell'
	}
	if (obj.state == 'Denied') {
		itemTitle.className = 'red'
	}

	const latestVer = document.createElement('h4')
	latestVer.textContent = versions[versions.length - 1]

	const itemDescription = document.createElement('p')
	itemDescription.textContent = description

	info.appendChild(itemTitle)
	info.appendChild(itemDescription)

	const button = document.createElement('button')
	button.addEventListener('click', () => {
		approve(slug)
	})
	if (obj.state != 'Approved') {
		button.textContent = 'Approve'
	} else {
		button.textContent = 'Approved'
		button.disabled = true
		button.className = 'approved'
	}
	const button2 = document.createElement('button')
	button2.className = 'deny'
	button2.addEventListener('click', () => {
		deny(slug)
	})
	if (obj.state != 'Denied') {
		button2.textContent = 'Deny'
	} else {
		button2.textContent = 'Denied'
		button2.disabled = true
		button2.className = 'approved'
	}

	item.appendChild(img)
	item.appendChild(info)
	item.appendChild(button)
	item.appendChild(button2)
	item.appendChild(latestVer)

	content.appendChild(item)
}

async function approve(slug) {
	const options = {
		method: 'POST',
		headers: { 'Content-Type': 'application/json' },
		body: JSON.stringify({ state: 'Approved', slug })
	}

	fetch(`${server}/statechange`, options).catch((err) => console.error(err))
	clearTimeout(nextmaintimeout)
	main()
}

async function deny(slug) {
	const options = {
		method: 'POST',
		headers: { 'Content-Type': 'application/json' },
		body: JSON.stringify({ state: 'Denied', slug })
	}

	fetch(`${server}/statechange`, options).catch((err) => console.error(err))
	clearTimeout(nextmaintimeout)
	main()
}

async function main() {
	try {
		let mods = JSON.parse(await RFS())
		mods.sort((a, b) => {
			const order = { '?': 0, Approved: 1, Denied: 2 }
			return order[a.state] - order[b.state]
		})
		nextmaintimeout = setTimeout(main, 5000)
		while (document.getElementById('content').firstChild) document.getElementById('content').removeChild(document.getElementById('content').lastChild)
		for (const mod of mods) {
			if (!mod.nmr) addItem(mod)
		}
	} catch (err) {
		console.error(err)
	}
}
main()

window.onload = () => {
	modpackid.value = ''
	document.body.scrollTop = 0
	document.documentElement.scrollTop = 0
}
