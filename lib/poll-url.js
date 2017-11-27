'use strict'

const slugg = require('slugg')
const {stringify} = require('querystring')

const pollUrl = (poll) => {
	let res = [
		'/p',
		encodeURIComponent(poll.slug || slugg(poll.title)),
		poll.id
	].join('/')

	if (poll.voteKey) res += '?' + stringify({'vote-key': poll.voteKey})
	return res
}

module.exports = pollUrl
