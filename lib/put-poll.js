'use strict'

const pick = require('lodash/pick')
const parallel = require('async/parallel')

const putVote = require('./put-vote')

const nonEmptyStr = name => new Error(name + ' must be a non-empty string')

const putPoll = (db, p, cb) => {
	if ('string' !== typeof p.id) throw nonEmptyStr('poll.id')
	if (p.id.length !== 12) throw new Error('poll.id must have 12 chars')
	if ('string' !== typeof p.title || !p.title) throw nonEmptyStr('poll.title')
	if ('string' !== typeof p.author || !p.author) throw nonEmptyStr('poll.author')
	if ('number' !== typeof p.created) throw new Error('poll.created must be a number')
	if ((p.created * 1000) > Date.now()) throw new Error('poll.created must be in the past')
	if ('object' !== typeof p.choices || Array.isArray(p.choices)) {
		new Error('vote.choices[] must be an object')
	}
	if (Object.keys(p.choices).length === 0) new Error('poll.choices must not be empty')

	// todo: handle changed choices, handle changed votes

	const val = pick(p, ['id', 'title', 'author', 'created', 'choices'])
	db.put('poll-' + val.id, val, (err) => {
		if (err) return cb(err)
		if (!('votes' in p)) return cb()
		if (!Array.isArray(p.votes)) throw new Error('poll.votes must be an array')
		if (p.votes.length === 0) return cb()

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
