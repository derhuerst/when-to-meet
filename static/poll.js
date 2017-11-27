'use strict'

const docReady = require('document-ready')

const on = 'yes'
const maybe = 'maybe'
const off = 'no'
const validValues = [on, maybe, off]

const cls = 'maybe'
const selector = '.three-states-checkbox'

// the third state will occur after :checked
const makeThreeStateCheckbox = (wrapper) => {
	const hidden = wrapper.querySelector('input[type="hidden"]')
	if (!hidden) throw new Error(`invalid ${selector} wrapper`)
	if (validValues.includes(hidden.value)) return; // already converted

	const visible = wrapper.querySelector('input[type="checkbox"]')
	if (!visible) throw new Error(`invalid ${selector} wrapper`)

	const applyToHidden = () => {
		const oldState = hidden.value

		if (oldState === on) {
			hidden.value = maybe
			wrapper.classList.add(cls)
			visible.checked = true
		} else if (oldState === maybe) {
			hidden.value = off
			wrapper.classList.remove(cls)
			visible.checked = false
		} else if (oldState === off) {
			hidden.value = on
			wrapper.classList.remove(cls)
			visible.checked = true
		} else {
			hidden.value = visible.checked ? on : off
		}
	}

	visible.addEventListener('change', applyToHidden)
	setTimeout(applyToHidden, 0)
}

docReady(() => {
	const all = Array.from(document.querySelectorAll(selector))
	for (let wrapper of all) makeThreeStateCheckbox(wrapper)
})
