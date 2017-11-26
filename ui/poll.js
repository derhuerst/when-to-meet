'use strict'

const h = require('h2ml')

const {meta, stylesheet} = require('./lib')
const renderPage = require('./page')
const site = require('../lib/site')

const renderPoll = (poll) => {
	const head = [
		meta('author', poll.author),
		stylesheet('/static/poll.css')
	]

	const content = poll.title // todo

	return renderPage(site, poll, content)
}

module.exports = renderPoll
