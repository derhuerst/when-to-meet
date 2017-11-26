'use strict'

const includingFirst = '!'
const includingLast = '~'

const getPoll = (db, id, cb) => {
	db.get('poll-' + id, (err, poll) => {
		if (err) return cb(err)

		const votes = db.createValueStream({
			gt: 'vote-' + id + '-' + includingFirst,
			lt: 'vote-' + id + '-' + includingLast
		})
		votes.once('error', (err) => {
			votes.destroy(err)
			cb(err)
		})

		poll.votes = []
		votes.on('data', (vote) => {
			poll.votes.push(vote)
		})

		votes.once('end', () => cb(null, poll))
	})
}

module.exports = getPoll
