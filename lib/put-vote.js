'use strict'

const pick = require('lodash/pick')

const KEYS = [
	'id',
	'pollId',
	'author', // string
	'choices' // array, `choiceId` with key in poll.choices and `available` boolean
]

const putVote = (db, v, cb) => {
	if ('string' !== typeof v.id || !v.id) throw nonEmptyStr('vote.id')
	if ('string' !== typeof v.pollId || !v.pollId) throw nonEmptyStr('vote.pollId')
	v = pick(v, KEYS)

	const key = 'vote-' + v.pollId + '-' + v.id
	db.put(key, v, cb)
}

module.exports = putVote
