'use strict'

const pick = require('lodash/pick')
const parallel = require('async/parallel')

const putVote = require('./put-vote')

const nonEmptyStr = name => new Error(name + ' must be a non-empty string')

const KEYS = [
	'id',
	'title', // string
	'author', // string
	'created', // timestamp
	'choices' // object, choices by their ids
]

const putPoll = (db, p, cb) => {
	if ('string' !== typeof p.id || !p.id) throw nonEmptyStr('poll.id')

	// todo: handle changed choices

	const val = pick(p, KEYS)
	db.put('poll-' + p.id, val, (err) => {
		if (err) return cb(err)
		if (!Array.isArray(p.votes)) return cb()

		const tasks = p.votes.map((v) => {
			v = Object.assign({}, v, {pollId: p.id})
			return (cb) => putVote(db, v)
		})
		parallel(tasks, (err) => {
			if (err) cb(err)
			else cb()
		})
	})
}

module.exports = putPoll
