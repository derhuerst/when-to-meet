'use strict'

const h = require('h2ml')

const viewport = h('meta', {
	name: 'viewport',
	content: 'width=device-width,initial-scale=1'
})

const meta = (key, value) => {
	return h('meta', {name: key, content: value})
}

const noReferrer = h('meta', {
	name: 'referrer',
	content: 'never'
})

const stylesheet = (href) => {
	return h('link', {
		rel: 'stylesheet',
		type: 'text/css',
		media: 'screen',
		href
	})
}

const script = (href) => {
	return h('script', {
		type: 'application/javascript',
		src: href
	})
}

const icon = (href) => {
	return h('link', {
		rel: 'icon',
		type: 'image/png',
		href
	})
}

module.exports = {
	viewport, meta, noReferrer, stylesheet, script, icon
}
