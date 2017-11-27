'use strict'

const randomId = require('crypto-random-string')
const escapeHtml = require('escape-html')
const slugg = require('slugg')

const putPoll = require('../lib/put-poll')
const pollUrl = require('../lib/poll-url')

const missingParamErr = (name) => {
	const err = new Error('missing ' + name + ' parameter')
	err.statusCode = 400
	return err
}

const createPoll = (req, res, next) => {
	if (!req.body.title) return next(missingParamErr('title'))
	if (!req.body.author) return next(missingParamErr('author'))

	const val = {
		id: randomId(12),
		title: escapeHtml(req.body.title.slice(0, 50)),
		author: escapeHtml(req.body.author.slice(0, 50)),
		created: Math.floor(Date.now() / 1000),
		voteKey: randomId(10),
		choices: {}
	}

	putPoll(req.app.locals.db, val, (err) => {
		if (err) return next(err)

		const poll = Object.assign({
			locale: req.locales[0] || null,
			slug: slugg(val.title)
		}, val)
		res.redirect(302, pollUrl(poll))
	})
}

module.exports = createPoll
