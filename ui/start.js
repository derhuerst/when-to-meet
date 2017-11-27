'use strict'

const h = require('h2ml')

const pkg = require('../package.json')
const renderPage = require('./page')
const {stylesheet} = require('./lib')
const site = require('../lib/site')

const renderTextField = (title, inputProps) => {
	return h('label', {}, [
		title,
		h('input', Object.assign({
			type: 'text'
			// todo: tabindex
		}, inputProps))
	])
}

const renderStart = () => {
	const content = [
		h('p', {id: 'slogan'}, pkg.description),
		h('form', {
			class: 'create',
			action: '/p',
			method: 'post'
		}, [
			renderTextField('Title', {
				name: 'title',
				class: 'create-title',
				required: 'required',
				maxlength: '50',
				minlength: '1',
				placeholder: 'What is the occasion?'
			}),
			renderTextField('Author', {
				name: 'author',
				class: 'create-author',
				required: 'required',
				maxlength: '50',
				minlength: '1',
				placeholder: 'What is you name?'
			}),
			h('input', {
				type: 'submit',
				value: 'create poll'
			})
		])
	].join('\n')

	return renderPage(site, {
		title: 'Start',
		summary: pkg.description,
		head: [stylesheet('/static/start.css')]
	}, content)
}

module.exports = renderStart
