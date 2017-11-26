'use strict'

const docReady = require('document-ready')

const on = 'checked'
const maybe = 'maybe'
const off = 'unchecked'

const cls = 'third-state'
const attr = 'data-third-state'
const selector = '.three-states-checkbox'

// the third state will occur after :checked
const makeThreeStateCheckbox = (wrapper) => {
	const hidden = wrapper.querySelector('input[type="hidden"]')
	if (!hidden) throw new Error(`invalid ${selector} wrapper`)
	if (hidden.hasAttribute(attr)) return; // already converted

	const visible = wrapper.querySelector('input[type="checkbox"]')
	if (!visible) throw new Error(`invalid ${selector} wrapper`)

	visible.addEventListener('change', () => {
		const oldState = hidden.getAttribute(attr)

		if (oldState === on) {
			hidden.setAttribute(attr, maybe)
			wrapper.classList.add(cls)
			visible.checked = true
		} else if (oldState === maybe) {
			hidden.setAttribute(attr, off)
			wrapper.classList.remove(cls)
			visible.checked = false
		} else if (oldState === off) {
			hidden.setAttribute(attr, on)
			wrapper.classList.remove(cls)
			visible.checked = true
		} else {
			hidden.setAttribute(attr, visible.checked ? on : off)
		}
	})
}

docReady(() => {
	const all = Array.from(document.querySelectorAll(selector))
	for (let wrapper of all) makeThreeStateCheckbox(wrapper)
})
