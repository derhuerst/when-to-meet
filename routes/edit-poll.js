'use strict'

const accepts = require('accepts')

const getPoll = require('../lib/get-poll')
const renderEditPoll = require('../ui/edit-poll')

const unauthorizedErr = (msg) => {
	const err = new Error(msg)
	err.statusCode = 401
	return err
}

const editPoll = (req, res, next) => {
	if (!req.params || !req.params.id) return next()
	if (!req.app || !req.app.locals || !req.app.locals.db) return next()

	// todo: accept POST request with data

	if (accepts(req).type('html') !== 'html') return next()
	if (!req.query['edit-key']) return next(unauthorizedErr('missing edit key'))

	getPoll(req.app.locals.db, req.params.id, (err, poll) => {
		if (err) return next(err)
		if (req.query['edit-key'] !== poll.editKey) {
			return next(unauthorizedErr('invalid edit key'))
		}

		poll.locale = req.locales[0] || null
		poll.slug = req.params.title || null // todo: add poll.slug prop

		try {
			const html = renderEditPoll(poll)
			res.status(200)
			res.type('html')
			res.end(html)
		} catch (err) {
			next(err)
		}
	})
}

module.exports = editPoll
