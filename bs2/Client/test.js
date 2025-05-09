const mainapi = 'https://api.modrinth.com/v2'
const serverinb = document.getElementById('server')
const username = document.getElementById('username')
const search = document.getElementById('search')
const ver = document.getElementById('ver')
const loader = document.getElementById('loader')
let server
var offset = new Map()
let isUpdating = false
const requestsize = 20
var servercb

ver.addEventListener('input', () => {
	search.dispatchEvent(new Event('input'))
})
loader.addEventListener('change', () => {
	search.dispatchEvent(new Event('input'))
})
serverinb.addEventListener('input', () => {
	const url = serverinb.value.trim()
	server = url === '' ? '' : url.startsWith('http://') || url.startsWith('https://') ? url : `http://${url}`
	search.dispatchEvent(new Event('input'))
})
search.addEventListener('input', async () => {
	isUpdating = true
	document.body.scrollTop = 0
	document.documentElement.scrollTop = 0
	offset.clear()
	let results = JSON.parse(await searchMR(search.value))
	while (document.getElementById('content').firstChild) document.getElementById('content').removeChild(document.getElementById('content').lastChild)
	for (const mod of results.hits) {
		addItem(mod)
	}
	clearTimeout(servercb)
	RFS()
	isUpdating = false
})
async function searchMR(query) {
	const xmlHttp = new XMLHttpRequest()

	return new Promise((resolve, reject) => {
		xmlHttp.onreadystatechange = function () {
			if (xmlHttp.readyState === 4) {
				if (xmlHttp.status === 200) {
					const currentOffset = offset.get(query ?? '') ?? 0
					const newOffset = currentOffset + requestsize
					offset.set(query ?? '', newOffset)
					resolve(xmlHttp.responseText)
				} else {
					reject(new Error(`Request failed with status ${xmlHttp.status} and error ${xmlHttp.responseText}`))
				}
			}
		}

		const baseUrl = `${mainapi}/search`
		const facetsParam = encodeURIComponent(`[["project_type:mod"]${(ver.value.trim() == '' ? '' : `,["versions:${ver.value}"]`) + (loader.value == 'both' ? '' : `,["categories:${loader.value}"]`)}]`)
		const queryParam = query ? `query=${encodeURIComponent(query)}&` : ''

		const url = `${baseUrl}?${queryParam}facets=${facetsParam}&offset=${offset.get(query ?? '') ?? 0}&limit=${requestsize}`

		xmlHttp.open('GET', url, true)
		xmlHttp.setRequestHeader('User-Agent', 'insomnia/10.3.0')
		xmlHttp.send(null)
	})
}

async function STS(mod) {
	if (!server) {
		alert('No server = no bitches')
		return
	}

	try {
		const response = await fetch(server, {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json'
			},
			body: JSON.stringify({ mod, username: username.value })
		})

		if (!response.ok) {
			if (response.status != 500) throw new Error(`Request failed with status ${response.status}`)
			else alert('Kaji na gogo da si oprai servera')
		}

		return await response.text()
	} catch (error) {
		console.error('Error:', error.message)
		throw error
	}
}

async function RFS() {
	servercb = setTimeout(RFS, 5000)
	if (!server) {
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

		const serverData = await response.json()

		const buttons = document.querySelectorAll('.item button')
		serverData.forEach((data) => {
			buttons.forEach((button) => {
				const item = button.closest('.item')
				const link = item.querySelector('a')
				const itemSlug = link.href.split('/').pop()

				if (itemSlug === data.mod.slug) {
					if (data.state === 'Approved') {
						button.textContent = 'Approved'
						button.className = 'approved'
						button.disabled = true
					} else if (data.state === 'Denied') {
						button.textContent = 'Denied'
						button.className = 'deny'
						button.disabled = true
					} else if (data.state === '?') {
						button.textContent = 'Awaiting approval'
						button.className = 'yell'
						button.disabled = true
					}
				}
			})
		})
	} catch (error) {
		if (error.message.includes('NetworkError') || error.message.includes('Failed to fetch') || error.message.includes('CORS')) {
		} else {
			console.error('An unexpected error occurred:', error)
			throw error
		}
	}
}

function addItem(obj) {
	const { icon_url, title, description, slug, versions } = obj
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

	const latestVer = document.createElement('h4')
	latestVer.textContent = ver.value == '' ? versions[versions.length - 1] : ver.value

	const itemDescription = document.createElement('p')
	itemDescription.textContent = description

	info.appendChild(itemTitle)
	info.appendChild(itemDescription)

	const button = document.createElement('button')
	button.textContent = 'Install'
	button.addEventListener('click', () => {
		STS(obj)
		button.textContent = 'Awaiting approval'
		button.className = 'yell'
		button.disabled = true
	})

	item.appendChild(img)
	item.appendChild(info)
	item.appendChild(button)
	item.appendChild(latestVer)

	content.appendChild(item)
}

async function updatePage(q) {
	let results = JSON.parse(await searchMR(q))
	for (const mod of results.hits) {
		addItem(mod)
	}
}

async function main() {
	await updatePage()
	RFS()
}
main()

window.onscroll = function () {
	const nearBottom = window.innerHeight + Math.round(window.scrollY) >= document.body.offsetHeight - 300

	if (nearBottom && !isUpdating) {
		isUpdating = true
		updatePage(search.value ?? undefined).finally(() => {
			isUpdating = false
		})
	}
}
window.onload = () => {
	search.value = ''
	serverinb.value = ''
	ver.value = ''
	loader.value = 'both'
	document.body.scrollTop = 0
	document.documentElement.scrollTop = 0
}
