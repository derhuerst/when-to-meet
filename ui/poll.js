'use strict'

const h = require('h2ml')
const {DateTime} = require('luxon')
const countBy = require('lodash/countBy')
const ms = require('ms')
const slugg = require('slugg')

const {meta, stylesheet, script} = require('./lib')
const renderPage = require('./page')
const site = require('../lib/site')

const hasProp = (o, k) => Object.prototype.hasOwnProperty.call(o, k)

const renderChoice = (choice, locale) => {
	// todo: pull timezone from poll
	const start = DateTime.fromISO(choice.date, {locale})
		.plus({seconds: choice.timeFrom})
	const end = DateTime.fromISO(choice.date)
		.plus({seconds: choice.timeTo})

	const month = start.toFormat('LLL')
	const day = start.toFormat('c')
	const dayOfWeek = start.toFormat('ccc')
	const startISO = start.toISO()
	const startTime = start.toLocaleString(DateTime.TIME_SIMPLE)
	const endISO = end.toISO()
	const endTime = end.toLocaleString(DateTime.TIME_SIMPLE)

	// todo: properly render day overflows
	return h('div', {
		class: 'poll-choice'
	}, [
		h('div', {class: 'poll-choice-month'}, month),
		h('div', {class: 'poll-choice-day'}, day),
		h('div', {class: 'poll-choice-day-of-week'}, dayOfWeek),
		h('div', {class: 'poll-choice-time'}, [
			h('time', {
				class: 'poll-choice-start-time',
				datetime: startISO
			}, startTime),
			' – ',
			h('time', {
				class: 'poll-choice-end-time',
				datetime: endISO
			}, endTime)
		])
	])
}

const pollSubmitName = h('td', {}, [
	h('input', {
		type: 'text',
		form: 'poll-submit',
		name: 'name',
		class: 'poll-submit-name',
		required: 'required',
		autocomplete: 'given-name',
		inputmode: 'verbatim',
		maxlength: '50',
		minlength: '1',
		placeholder: 'your name' // todo: use a <label>
		// todo: tabindex
	})
])

const renderCreated = (when, locale) => {
	const dt = DateTime.fromMillis(when, {locale})

	return h('abbr', {
		title: dt.toLocaleString(DateTime.DATETIME_FULL)
	}, [
		h('time', {
			datetime: dt.toISO()
		}, [
			ms(Date.now() - when, {long: true}),
			' ago'
		])
	])
}

const renderThreeStatesCheckbox = (props) => {
	const inputProps = Object.assign({}, props)
	inputProps.type = 'checkbox'
	delete inputProps.form
	delete inputProps.name

	return h('div', {class: 'three-states-checkbox'}, [
		h('input', {
			type: 'hidden',
			form: props.form,
			name: props.name
		}),
		h('input', inputProps)
	])
}

const renderSummary = (poll, choiceId) => {
	let count = 0
	for (let vote of poll.votes) {
		for (let chosen of vote.choices) {
			if (chosen.choiceId === choiceId && chosen.available) count++
		}
	}

	return h('abbr', {
		title: count + ' people are available'
	}, ['✔︎ ' + count])
}

const renderPoll = (poll, locale) => {
	const choices = [
		h('td') // empty top left field
	]
	const summary = [
		h('td', {}, [poll.votes.length + ' participants'])
	]
	const submit = [
		pollSubmitName
	]
	for (let choiceId of Object.keys(poll.choices)) {
		const choice = poll.choices[choiceId]

		choices.push(h('td', {}, [renderChoice(choice, locale)]))
		summary.push(h('td', {}, [renderSummary(poll, choiceId)]))
		submit.push(h('td', {}, [
			// todo: use a <label>
			renderThreeStatesCheckbox({
				form: 'poll-submit',
				name: 'choice-' + choiceId,
				class: 'poll-submit-choice'
				// todo: tabindex
			})
		]))
	}

	const votes = []
	for (let vote of poll.votes) {
		const cells = [
			h('td', {}, vote.author)
		]

		for (let choiceId of Object.keys(poll.choices)) {
			const chosen = vote.choices.find(c => c.choiceId === choiceId)
			let text = '?'
			let cls = 'poll-unknown'
			if (chosen) {
				text = chosen.available ? '✔︎' : '✘'
				cls = chosen.available ? 'poll-available' : 'poll-unavailable'
			}

			// todo: alt text or <abbr>
			cells.push(h('td', {class: cls}, [text]))
		}

		votes.push(h('tr', {}, cells))
	}

	const url = '/p/' + encodeURIComponent(slugg(poll.title)) + '/' + poll.id
	const content = [
		h('h2', {id: 'poll-title'}, poll.title),
		h('p', {id: 'poll-meta'}, [
			'created ',
			renderCreated(poll.created * 1000, locale),
			' by ',
			poll.author
		]),
		h('table', {
			id: 'poll',
			class: 'poll'
		}, [
			h('tr', {class: 'poll-choices'}, choices),
			h('tr', {class: 'poll-summary'}, summary),
			h('tr', {class: 'poll-submit'}, submit)
		].concat(votes)),
		h('form', {
			id: 'poll-submit',
			action: '/polls/' + poll.id,
			method: 'post'
		}, [
			h('input', {
				type: 'submit',
				value: 'submit'
			})
		])
	].join('\n')

	const page = Object.assign({}, poll, {
		head: [
			meta('author', poll.author),
			stylesheet('/static/poll.css'),
			script('/static/poll.bundle.js')
		]
	})
	return renderPage(site, page, content)
}

module.exports = renderPoll
