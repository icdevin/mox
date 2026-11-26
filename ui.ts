/// <reference path="webui/css.d.ts" />
import {dom, attr, style, ElemArg} from './lib'
import themeCSS from './webui/theme.css'
import settingsCSS from './webui/settings.css'
import componentCSS from './webui/component.css'




// Installing shared foundations before page-specific and administrator overrides.
export const installUI = (settings: boolean) => {
	const sheet = document.createElement('style')
	sheet.textContent = themeCSS + componentCSS
	if (settings) {
		sheet.textContent += settingsCSS
	}
	document.head.prepend(sheet)
}

export const callout = (color: string, ...kids: ElemArg[]) => dom.div(dom._class('uiCallout'), style({backgroundColor: color}), kids)

export const section = (title: string, ...kids: ElemArg[]) => dom.div(dom._class('uiSection'), dom.h2(title), kids)

export const themeControl = (select: HTMLSelectElement, storageKey: string) => {
	const system = window.matchMedia('(prefers-color-scheme: dark)')
	try {
		const saved = localStorage.getItem(storageKey)
		if (saved && ['system', 'light', 'dark'].includes(saved)) { select.value = saved }
	} catch (_) { /* Keeping theme selection usable without local storage. */ }
	const apply = () => {
		let dark = select.value === 'dark'
		if (select.value === 'system') { dark = system.matches }
		document.documentElement.dataset.theme = 'light'
		if (dark) { document.documentElement.dataset.theme = 'dark' }
	}
	select.addEventListener('change', () => {
		apply()
		try { localStorage.setItem(storageKey, select.value) } catch (_) { /* Keeping the selected theme for this session. */ }
	})
	system.addEventListener('change', apply)
	apply()
}

// Keeping dismissal, keyboard focus and visual treatment consistent across applications.
export const dialog = (onClose: () => void, ...kids: ElemArg[]) => {
	const original = document.activeElement
	let root: HTMLElement
	const close = () => {
		if (!root.isConnected) { return }
		root.remove()
		onClose()
		if (original instanceof HTMLElement && original.isConnected) { original.focus() }
	}
	let content: HTMLElement
	root = dom.div(dom._class('uiOverlay'),
		function click() { close() },
		function keydown(e: KeyboardEvent) {
			if (e.key === 'Escape') { e.stopPropagation(); close(); return }
			if (e.key !== 'Tab') { return }
			const focusable = Array.from(content.querySelectorAll<HTMLElement>('button, input, select, textarea, a[href], [tabindex]')).filter(e => e.tabIndex >= 0 && !e.matches(':disabled') && e.getClientRects().length > 0)
			if (!focusable.length) { e.preventDefault(); content.focus(); return }
			const first = focusable[0], last = focusable[focusable.length-1]
			if (e.shiftKey && (document.activeElement === first || document.activeElement === content)) { e.preventDefault(); last.focus() }
			else if (!e.shiftKey && (document.activeElement === last || document.activeElement === content)) { e.preventDefault(); first.focus() }
		},
		content=dom.div(dom._class('uiDialog'), attr.tabindex('-1'), dom._attrs({role: 'dialog', 'aria-modal': 'true', 'aria-label': 'Dialog'}),
			function click(e: MouseEvent) { e.stopPropagation() }, kids))
	const title = content.querySelector('h1, h2')
	if (title) { content.setAttribute('aria-label', title.textContent || 'Dialog') }
	document.body.append(root)
	content.focus()
	return close
}

export const detailLine = (label: string, ...value: ElemArg[]) => dom.div(dom._class('queueInfo'), dom.span(dom._class('queueInfoLabel'), label), value)

export const sessionNotice = (reason: string) => {
	let message = reason
	if (reason.startsWith('unknown session')) {
		message = 'Your session has ended. Enter your password to continue.'
	}
	const notice = dom.div(dom._class('loginNotice'), dom._attrs({role: 'status'}),
		dom.div(dom._class('loginNoticeTitle'), 'Please sign in again'), dom.div(message))
	notice.hidden = !reason
	return notice
}
