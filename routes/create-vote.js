'use strict'

const randomId = require('crypto-random-string')
const escapeHtml = require('escape-html')
const difference = require('lodash/difference')

const getPoll = require('../lib/get-poll')
const putVote = require('../lib/put-vote')
const pollUrl = require('../lib/poll-url')

const createVote = (req, res, next) => {
	if (!req.params || !req.params.id) return next()

	if (!req.body['vote-key']) {
		const err = new Error('missing vote key')
		err.statusCode = 401
		return next(err)
	}

	getPoll(res.app.locals.db, req.params.id, (err, poll) => {
		if (err) return next(err)

		if (poll.voteKey !== req.body['vote-key']) {
			const err = new Error('invalid vote key')
			err.statusCode = 401
			return next(err)
		}

		const val = {
			id: randomId(8),
			pollId: poll.id,
			choices: []
		}
		for (let k of Object.keys(req.body)) {
			if (k === 'author') val.author = escapeHtml(req.body.author)
			else if (k === 'vote-key') continue
			else {
				const choiceId = k.slice('choice-'.length)
				if (!poll.choices[choiceId]) {
					const err = new Error('invalid choice ID ' + choiceId)
					err.statusCode = 400
					return next(err)
				}
				val.choices.push({choiceId, value: req.body[k]})
			}
		}

		const sentChoices = val.choices.map(c => c.choiceId)
		const allChoices = Object.keys(poll.choices)
		for (let choiceId of allChoices) {
			if (!sentChoices.includes(choiceId)) {
					const err = new Error('missing choice for ' + choiceId)
					err.statusCode = 400
					return next(err)
			}
		}

		putVote(res.app.locals.db, val, (err) => {
			if (err) return next(err)

			poll.canVote = req.body['vote-key'] === poll.voteKey
			poll.locale = req.locales[0] || null
			poll.slug = req.params.title || null
			res.redirect(302, pollUrl(poll))
		})
	})
}

module.exports = createVote
