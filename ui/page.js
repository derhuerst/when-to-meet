'use strict'

const h = require('h2ml')

const {viewport, meta, noReferrer, icon, stylesheet, script} = require('./lib')

const renderHead = (site, page) => {
	let items = [
		h('meta', {charset: 'utf-8'}),
		viewport,
		h('title', {}, [
			page.title || '',
			'–',
			site.title
		].join(' ')),
		meta('summary', page.summary || ''),
		meta('description', page.description || ''),
		noReferrer,
		icon('/static/icon.png'),
		stylesheet('/static/system-font.css'),
		stylesheet('/static/base.css'),
		stylesheet('/static/forms.css')
	]
	if (page.head) items = items.concat(page.head)

	return h('head', {}, items)
}

const renderNav = (site, page) => {
	return h('nav', {id: 'nav'}, [
		h('h1', {id: 'logo'}, [
			h('a', {href: '/'}, site.title)
		])
	])
}

const doctype = '<!DOCTYPE html>'
const renderPage = (site, page, content) => {
	const body = [
		renderNav(site, page),
		h('main', {id: 'content'}, '' + content)
	]
	if (page.scripts) {
		for (let s of page.scripts) body.push(script(s))
	}

	return doctype + h('html', {
		lang: page.language || site.language
	}, [
		renderHead(site, page),
		h('body', {}, body)
	])
}

module.exports = renderPage
