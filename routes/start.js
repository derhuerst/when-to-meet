'use strict'

const accepts = require('accepts')

const renderStart = require('../ui/start')

const start = (req, res, next) => {
	if (accepts(req).type('html') !== 'html') return next()

	const html = renderStart()
	res.status(200)
	res.type('html')
	res.end(html)
}

module.exports = start
