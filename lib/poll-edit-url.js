'use strict'

const slugg = require('slugg')
const {stringify} = require('querystring')

const pollEditUrl = (poll) => {
	if (!poll.editKey) throw new Error('missing poll.editKey')

	return '/' + [
		'p',
		encodeURIComponent(poll.slug || slugg(poll.title)),
		poll.id,
		'edit'
	].join('/') + '?' + stringify({'edit-key': poll.editKey})
}

module.exports = pollEditUrl
