'use strict'

const randomId = require('crypto-random-string')
const slugg = require('slugg')
const difference = require('lodash/difference')

const getPoll = require('../lib/get-poll')
const putVote = require('../lib/put-vote')

const createVote = (req, res, next) => {
	if (!req.params || !req.params.id) return next()
	getPoll(res.app.locals.db, req.params.id, (err, poll) => {
		if (err) return next(err)

		const val = {
			id: randomId(8),
			pollId: poll.id,
			choices: []
		}
		for (let k of Object.keys(req.body)) {
			if (k === 'author') val.author = req.body.author
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

			// todo: add a poll.slug prop
			const url = '/p/' + encodeURIComponent(slugg(poll.title)) + '/' + poll.id
			res.redirect(302, url)
		})
	})
}

module.exports = createVote
