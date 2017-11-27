'use strict'

const h = require('h2ml')

const renderChoiceSummary = (poll, choiceId) => {
	let count = 0
	for (let vote of poll.votes) {
		for (let c of vote.choices) {
			if (
				c.choiceId === choiceId &&
				(c.value === 'yes' || c.value === 'maybe')
			) count++
		}
	}

	return h('abbr', {
		title: count + ' people are available'
	}, ['✔︎ ' + count])
}

module.exports = renderChoiceSummary
