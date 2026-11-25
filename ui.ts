import {dom, attr, style, ElemArg} from './lib'

const themeCSS = `
:root {
  color-scheme: light;
  --uiColor: #282520; --muted: #625e58; --bg: #fcfaf7; --panel: #f6f3ee;
  --border: #e3ddd4; --control: #d7cfc4; --hover: #eee8df; --accent: #b94706;
  --contrast: #fff; --selected: #f6e8d9; --warning: #f8e7c5; --success: #dcebd8; --error: #f8dcd0;
}
:root[data-theme="dark"] {
  color-scheme: dark;
  --uiColor: #eee8df; --muted: #c4baad; --bg: #211e1a; --panel: #28241f;
  --border: #41392f; --control: #5f5243; --hover: #383026; --accent: #e99a5d;
  --contrast: #211e1a; --selected: #47301d; --warning: #503b20; --success: #293e29; --error: #552e24;
}

:root { --color: var(--uiColor); --fontUI: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; --fontBrand: Georgia, serif; }
`

const settingsCSS = `
.loginAttemptsTable { table-layout: fixed; overflow-wrap: anywhere; }
.loginAttemptsTable td { vertical-align: top; }
.loginAttemptsTable .loginAttemptsCount { width: 64px; }
.loginAttemptsTable .queueInfo:first-child { margin-top: 0; }
@media (max-width: 760px) { .loginAttemptsTable th, .loginAttemptsTable td { padding: 6px 4px; } }
.queueInfo { margin-top: 4px; }
.queueInfoLabel { color: var(--muted); margin-right: 6px; font-size: 12px; }
.uiBadge { display: inline-block; padding: 2px 6px; border-radius: 4px; font-size: 12px; }
.uiBadgeError { background: var(--error); }

* { box-sizing: border-box; }
html, body { margin: 0; padding: 0; }
body { background: var(--bg); color: var(--color); font: 14px/1.5 var(--fontUI); }
a { color: var(--accent); text-underline-offset: 3px; }
button, input, select, textarea { font: inherit; color: inherit; }
button, select, input, textarea { border: 1px solid var(--control); border-radius: 6px; background: var(--bg); padding: 6px 10px; max-width: 100%; }
button, select { min-height: 36px; cursor: pointer; }
input:not([type=checkbox]):not([type=radio]):not([type=hidden]), select:not([multiple]):not([size]) { height: 36px; }
button:hover { background: var(--hover); }
button[type=submit], button.primaryButton { background: var(--accent); color: var(--contrast); border-color: var(--accent); font-weight: 600; }
button:disabled, fieldset:disabled { opacity: .55; cursor: default; }
input[type=checkbox], input[type=radio] { accent-color: var(--accent); vertical-align: middle; margin: 0 4px 0 0; }
:focus-visible { outline: 2px solid var(--accent); outline-offset: 3px; }
fieldset { border: 0; padding: 0; margin: 0; min-width: 0; }
label { line-height: 1.8; }
h1, h2, h3, h4 { color: var(--color); line-height: 1.3; }
h1 { font-size: 24px; letter-spacing: -.5px; margin: 0 0 20px; }
h1 a { color: var(--muted); text-decoration: none; font-weight: 400; }
h2 { font-size: 19px; margin: 24px 0 12px; }
h3, h4 { font-size: 14px; margin: 16px 0 8px; }
p { margin: 0 0 16px; max-width: 65em; }
ul { padding-left: 22px; }
li { margin: 3px 0; }
[title] { text-decoration: none; }
[title]:hover { text-decoration: underline dotted; text-underline-offset: 3px; }
button[title]:hover, a[title]:hover { text-decoration: none; }
.uiHeader { min-height: 74px; flex-wrap: wrap; display: flex; align-items: center; gap: 20px; padding: 0 24px; border-bottom: 1px solid var(--border); background: var(--panel); }
.brandName { font: bold 38px var(--fontBrand); letter-spacing: -1.5px; text-decoration: none; color: var(--color); }
.uiHeader > span { color: var(--muted); border-left: 1px solid var(--control); padding-left: 20px; }
.uiHeader label { margin-left: auto; color: var(--muted); display: flex; align-items: center; gap: 8px; }
.uiHeader > a:not(.brandName) { text-decoration: none; }
.uiLayout { display: grid; grid-template-columns: 190px minmax(0, 1fr); min-height: calc(100vh - 74px); }
.uiNav { background: var(--panel); border-right: 1px solid var(--border); padding: 16px 10px; }
.uiNav a { display: block; color: var(--color); text-decoration: none; padding: 5px 10px; border-radius: 5px; margin: 1px 0; }
.uiNav a:hover { background: var(--hover); }
.uiNav a[aria-current=page] { background: var(--selected); color: var(--accent); font-weight: 600; }
.uiNav strong { display: block; font-size: 11px; text-transform: uppercase; letter-spacing: .08em; color: var(--muted); padding: 20px 10px 5px; }
#page { min-width: 0; padding: 28px 32px; overflow-x: auto; }
#page > div { max-width: 1500px; }
#page > div > br { display: none; }
form { margin: 12px 0; }
form > fieldset > label { margin: 0 10px 8px 0; }
table { width: 100%; border-spacing: 0; border-collapse: collapse; font-size: 13px; }
td, th { padding: 7px 10px; text-align: left; border-bottom: 1px solid var(--border); }
td.alignRight, th.alignRight { text-align: right; font-variant-numeric: tabular-nums; }
th { color: var(--muted); font-weight: 600; background: var(--panel); }
table table { width: auto; }
table table td, table table th { padding: 3px 6px; }
table.long > tbody > tr > td { padding: 10px; vertical-align: top; }
table.hover > tbody > tr:hover { background: var(--panel); }
thead { position: sticky; top: 0; z-index: 1; background: var(--panel); }
.literal, pre { background: var(--panel); padding: 12px 16px; border: 1px solid var(--border); border-radius: 6px; white-space: pre-wrap; overflow-wrap: anywhere; font: 13px/1.6 ui-monospace, monospace; tab-size: 4; }
.uiFooter { margin-top: 32px; padding-top: 12px; border-top: 1px solid var(--border); font-size: 12px; color: var(--muted); }
.uiLogin { background: var(--panel); }
.uiLogin .uiDialog { width: 340px; }
.uiLogin input { width: 100%; }
.uiLogin h1 { font: bold 38px var(--fontBrand); }
.uiLogin button { width: 100%; }
.loginNotice { margin: 0 0 20px; padding: 12px 14px; border: 1px solid var(--border); border-radius: 6px; background: var(--bg); font-size: 13px; line-height: 1.5; overflow-wrap: anywhere; }
.loginNoticeTitle { display: block; margin-bottom: 4px; font-weight: 600; }
.loginNotice > div:not(.loginNoticeTitle) { color: var(--muted); }
#page, .loadend { opacity: 1; }
#page.loading, .loadstart { opacity: .35; transition: opacity .15s; }
/* Keeping the caret inset while preserving native dropdown behavior. */
select:not([multiple]):not([size]), select:not([multiple])[size="1"] {
  appearance: none;
  padding-right: 32px;
  background-image: linear-gradient(45deg, transparent 50%, currentColor 50%), linear-gradient(135deg, currentColor 50%, transparent 50%);
  background-position: calc(100% - 14px) 50%, calc(100% - 10px) 50%;
  background-size: 4px 4px;
  background-repeat: no-repeat;
}
@media (forced-colors: active) {
  select:not([multiple]):not([size]), select:not([multiple])[size="1"] { appearance: auto; background-image: none; }
}


@media (max-width: 760px) {
 .uiHeader { padding: 12px 16px; gap: 12px; }
 .uiHeader > span { display: none; }
 .uiHeader label { font-size: 12px; }
 .uiLayout { display: block; }
 .uiNav { display: flex; gap: 4px; overflow-x: auto; border-right: 0; border-bottom: 1px solid var(--border); padding: 8px; }
 .uiNav strong { display: none; }
 .uiNav a { white-space: nowrap; }
 #page { padding: 20px 16px; }
 .uiSection { padding: 16px; }
}
`

const componentCSS = `
:root { --danger: #a52b27; --dangerBackground: #fce9e6; --dangerBorder: #d8a5a0; }
:root[data-theme="dark"] { --danger: #f2a099; --dangerBackground: #472a26; --dangerBorder: #90544d; }
button.dangerButton { color: var(--danger); border-color: var(--dangerBorder); background: transparent; }
button.dangerButton:hover:not(:disabled) { background: var(--dangerBackground); border-color: var(--danger); }
button.dangerButton:focus-visible { outline-color: var(--danger); }

.uiOverlay { position: fixed; inset: 0; background: #28252055; display: flex; align-items: center; justify-content: center; z-index: 50; padding: 16px; }
.uiDialog { background: var(--bg); border: 1px solid var(--border); border-radius: 10px; padding: 24px; box-shadow: 0 12px 36px #0002; max-width: 95vw; max-height: 95vh; overflow: auto; }
.uiSection { min-width: 0; margin: 0 0 24px; padding: 20px; border: 1px solid var(--border); border-radius: 8px; background: var(--panel); scroll-margin-top: 20px; }
.uiSection > h2:first-child { margin-top: 0; }
.uiSection > :last-child { margin-bottom: 0; }
.uiCallout { padding: 12px 14px; border: 1px solid var(--border); border-radius: 6px; margin: 12px 0; line-height: 1.5; overflow-wrap: anywhere; }
.uiCallout p:last-child { margin-bottom: 0; }
.uiActions { display: flex; flex-wrap: wrap; gap: 8px; align-items: center; margin-top: 16px; }
.uiHelp { padding: 12px 14px; border: 1px solid var(--border); border-radius: 6px; margin: 16px 0; }
.uiHelp summary { cursor: pointer; color: var(--muted); }
.uiHelp[open] summary { margin-bottom: 12px; }
.uiScroll { max-width: 100%; overflow: auto; }
.uiDialog { min-width: min(340px, 100%); }
.uiDialog:focus { outline: none; }
.uiDialog > h1:first-child { margin-top: 0; }

`

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
