'use strict'

const nonEmptyStr = name => new Error(name + ' must be a non-empty string')

const validValues = ['yes', 'maybe', 'no']

const putVote = (db, v, cb) => {
	if ('string' !== typeof v.id) throw nonEmptyStr('vote.id')
	if (v.id.length !== 8) throw new Error('vote.id must have 8 chars')
	if ('string' !== typeof v.pollId || !v.pollId) throw nonEmptyStr('vote.pollId')
	if (v.pollId.length !== 12) throw new Error('vote.pollId must have 12 chars')
	// todo: assert that poll behind vote.pollId exists
	if ('string' !== typeof v.author || !v.author) throw nonEmptyStr('vote.author')
	if (!Array.isArray(v.choices)) new Error('vote.choices must be an array')
	if (v.choices.length === 0) new Error('vote.choices must not be empty')

	const val = {
		id: v.id,
		pollId: v.pollId,
		author: v.author,
		choices: []
	}
	for (let c of v.choices) {
		if ('object' !== typeof c || Array.isArray(c)) {
			new Error('vote.choices[] must be an object')
		}
		if ('string' !== typeof c.choiceId || !c.choiceId) {
			throw nonEmptyStr('vote.choices[].choiceId')
		}
		if (c.choiceId.length !== 6) {
			throw new Error('vote.choices[].choiceId must have 6 chars')
		}
		// todo: assert that choice behind vote.choiceId exists
		if ('string' !== typeof c.value || !c.value) {
			throw nonEmptyStr('vote.choices[].value')
		}
		if (!validValues.includes(c.value)) {
			throw new Error('vote.choices[].value is invalid')
		}

		val.choices.push({
			choiceId: c.choiceId,
			value: c.value
		})
	}

	db.put('vote-' + val.pollId + '-' + val.id, val, cb)
}

module.exports = putVote
