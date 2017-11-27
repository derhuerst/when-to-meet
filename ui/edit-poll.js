'use strict'

const h = require('h2ml')
// const {DateTime} = require('luxon')
// const ms = require('ms')

const {stylesheet} = require('./lib')
const renderPage = require('./page')
const site = require('../lib/site')
const pollUrl = require('../lib/poll-url')
const pollEditUrl = require('../lib/poll-edit-url')

const renderTimeInput = (props) => {
	// todo: wrap in a <label>
	return h('input', Object.assign({
		type: 'time',
		pattern: '[0-9]{2}:[0-9]{2}'
		// todo: tabindex
	}, props))
}

const renderEditPoll = (poll) => {
	const rows = [
		// todo: use thead & tbody
		h('tr', {}, [
			h('td', {}, ['Day']),
			h('td', {}, ['From']),
			h('td', {}, ['To'])
		])
	]

	for (let choiceId of Object.keys(poll.choices)) {
		const choice = poll.choices[choiceId]

		rows.push(h('tr', {class: 'edit-choice'}, [
			h('td', {class: 'edit-choice-date'}, [
				h('input', {
					type: 'date',
					form: 'edit-submit',
					name: 'choice-' + choiceId + '-date',
					class: 'edit-choice-date-input',
					required: 'required',
					value: choice.date
					// todo: <label>, tabindex
				})
			]),
			h('td', {class: 'edit-choice-time-from'}, [
				renderTimeInput({
					form: 'edit-submit',
					name: 'choice-' + choiceId + '-time-from',
					class: 'edit-choice-time-from-input',
					required: 'required',
					value: choice.timeFrom
				})
			]),
			h('td', {class: 'edit-choice-time-to'}, [
				renderTimeInput({
					form: 'edit-submit',
					name: 'choice-' + choiceId + '-time-to',
					class: 'edit-choice-time-to-input',
					required: 'required',
					value: choice.timeTo
				})
			])
		]))
	}

	const content = [
		h('h2', {id: 'poll-title'}, [
			'Edit ',
			h('a', {
				href: pollUrl(poll)
				// todo: title
			}, [poll.title])
		]),
		h('table', {class: 'edit'}, rows),
		h('form', {
			id: 'edit-submit',
			action: pollEditUrl(poll),
			method: 'post'
		}, [
			h('input', {type: 'submit', value: 'save changes'})
		])
	].join('\n')

	const page = Object.assign({}, poll, {
		head: [stylesheet('/static/edit-poll.css')]
	})
	return renderPage(site, page, content)
}

module.exports = renderEditPoll
