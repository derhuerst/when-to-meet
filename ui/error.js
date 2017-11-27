'use strict'

const h = require('h2ml')

const renderPage = require('./page')
const site = require('../lib/site')

const renderError = (err) => {
	const content = [
		h('h2', {}, 'Oh Snap!'),
		h('p', {}, [
			'An ',
			h('code', {}, [err.code]),
			' error occured.'
		]),
		h('pre', {}, ['' + err])
	].join('\n')

	return renderPage(site, {
		title: err.type ? err.type : 'Oh Snap!',
		summary: err.message
	}, content)
}

module.exports = renderError
