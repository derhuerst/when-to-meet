'use strict'

const accepts = require('accepts')

const getPoll = require('../lib/get-poll')
const renderPoll = require('../ui/poll')

const showPoll = (req, res, next) => {
	if (!req.params || !req.params.id) return next()
	if (!req.app || !req.app.locals || !req.app.locals.db) return next()
	if (accepts(req).type('html') !== 'html') return next()

	getPoll(req.app.locals.db, req.params.id, (err, poll) => {
		if (err) return next(err)

		try {
			const html = renderPoll(poll)
			res.status(200)
			res.type('html')
			res.end(html)
		} catch (err) {
			next(err)
		}
	})
}

module.exports = showPoll
