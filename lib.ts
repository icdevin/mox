// Javascript is generated from typescript, do not modify generated javascript because changes will be overwritten.

export {dom, style, attr, prop, ElemArg}

type ElemArg = string | String | Element | Function | {_class: string[]} | {_attrs: {[k: string]: string}} | {_styles: {[k: string]: string | number}} | {_props: {[k: string]: any}} | {root: HTMLElement} | ElemArg[]

const _domKids = <T extends HTMLElement>(e: T, l: ElemArg[]): T => {
	l.forEach((c) => {
		const xc = c as {[k: string]: any}
		if (typeof c === 'string' || c instanceof String) {
			e.appendChild(document.createTextNode(''+c))
		} else if (c instanceof Element) {
			e.appendChild(c)
		} else if (c instanceof Function) {
			if (!c.name) {
				throw new Error('function without name')
			}
			e.addEventListener(c.name as string, c as EventListener)
		} else if (Array.isArray(xc)) {
			_domKids(e, c as ElemArg[])
		} else if (xc._class) {
			for (const s of xc._class) {
				e.classList.toggle(s, true)
			}
		} else if (xc._attrs) {
			for (const k in xc._attrs) {
				e.setAttribute(k, xc._attrs[k])
			}
		} else if (xc._styles) {
			for (const k in xc._styles) {
				const estyle: {[k: string]: any} = e.style
				estyle[k as string] = xc._styles[k]
			}
		} else if (xc._props) {
			for (const k in xc._props) {
				const eprops: {[k: string]: any} = e
				eprops[k] = xc._props[k]
			}
		} else if (xc.root) {
			e.appendChild(xc.root)
		} else {
			console.log('bad kid', c)
			throw new Error('bad kid')
		}
	})
	return e
}
const dom = {
	_kids: function(e: HTMLElement, ...kl: ElemArg[]) {
		while(e.firstChild) {
			e.removeChild(e.firstChild)
		}
		_domKids(e, kl)
	},
	_attrs: (x: {[k: string]: string}) => { return {_attrs: x}},
	_class: (...x: string[]) => { return {_class: x}},
	// The createElement calls are spelled out so typescript can derive function
	// signatures with a specific HTML*Element return type.
	div: (...l: ElemArg[]) => _domKids(document.createElement('div'), l),
	span: (...l: ElemArg[]) => _domKids(document.createElement('span'), l),
	a: (...l: ElemArg[]) => _domKids(document.createElement('a'), l),
	input: (...l: ElemArg[]) => _domKids(document.createElement('input'), l),
	textarea: (...l: ElemArg[]) => _domKids(document.createElement('textarea'), l),
	select: (...l: ElemArg[]) => _domKids(document.createElement('select'), l),
	option: (...l: ElemArg[]) => _domKids(document.createElement('option'), l),
	clickbutton: (...l: ElemArg[]) => _domKids(document.createElement('button'), [attr.type('button'), ...l]),
	submitbutton: (...l: ElemArg[]) => _domKids(document.createElement('button'), [attr.type('submit'), ...l]),
	form: (...l: ElemArg[]) => _domKids(document.createElement('form'), l),
	fieldset: (...l: ElemArg[]) => _domKids(document.createElement('fieldset'), l),
	table: (...l: ElemArg[]) => _domKids(document.createElement('table'), l),
	thead: (...l: ElemArg[]) => _domKids(document.createElement('thead'), l),
	tbody: (...l: ElemArg[]) => _domKids(document.createElement('tbody'), l),
	tfoot: (...l: ElemArg[]) => _domKids(document.createElement('tfoot'), l),
	tr: (...l: ElemArg[]) => _domKids(document.createElement('tr'), l),
	td: (...l: ElemArg[]) => _domKids(document.createElement('td'), l),
	th: (...l: ElemArg[]) => _domKids(document.createElement('th'), l),
	datalist: (...l: ElemArg[]) => _domKids(document.createElement('datalist'), l),
	h1: (...l: ElemArg[]) => _domKids(document.createElement('h1'), l),
	h2: (...l: ElemArg[]) => _domKids(document.createElement('h2'), l),
	details: (...l: ElemArg[]) => _domKids(document.createElement('details'), l),
	summary: (...l: ElemArg[]) => _domKids(document.createElement('summary'), l),
	h3: (...l: ElemArg[]) => _domKids(document.createElement('h3'), l),
	br: (...l: ElemArg[]) => _domKids(document.createElement('br'), l),
	hr: (...l: ElemArg[]) => _domKids(document.createElement('hr'), l),
	pre: (...l: ElemArg[]) => _domKids(document.createElement('pre'), l),
	label: (...l: ElemArg[]) => _domKids(document.createElement('label'), l),
	ul: (...l: ElemArg[]) => _domKids(document.createElement('ul'), l),
	li: (...l: ElemArg[]) => _domKids(document.createElement('li'), l),
	iframe: (...l: ElemArg[]) => _domKids(document.createElement('iframe'), l),
	b: (...l: ElemArg[]) => _domKids(document.createElement('b'), l),
	img: (...l: ElemArg[]) => _domKids(document.createElement('img'), l),
	style: (...l: ElemArg[]) => _domKids(document.createElement('style'), l),
	search: (...l: ElemArg[]) => _domKids(document.createElement('search'), l),
	p: (...l: ElemArg[]) => _domKids(document.createElement('p'), l),
	canvas: (...l: ElemArg[]) => _domKids(document.createElement('canvas'), l),
}
const _attr = (k: string, v: string) => { const o: {[key: string]: string} = {}; o[k] = v; return {_attrs: o} }
const attr = {
	title: (s: string) => _attr('title', s),
	value: (s: string) => _attr('value', s),
	type: (s: string) => _attr('type', s),
	tabindex: (s: string) => _attr('tabindex', s),
	src: (s: string) => _attr('src', s),
	placeholder: (s: string) => _attr('placeholder', s),
	href: (s: string) => _attr('href', s),
	checked: (s: string) => _attr('checked', s),
	selected: (s: string) => _attr('selected', s),
	id: (s: string) => _attr('id', s),
	datalist: (s: string) => _attr('datalist', s),
	rows: (s: string) => _attr('rows', s),
	target: (s: string) => _attr('target', s),
	rel: (s: string) => _attr('rel', s),
	required: (s: string) => _attr('required', s),
	multiple: (s: string) => _attr('multiple', s),
	download: (s: string) => _attr('download', s),
	disabled: (s: string) => _attr('disabled', s),
	draggable: (s: string) => _attr('draggable', s),
	rowspan: (s: string) => _attr('rowspan', s),
	colspan: (s: string) => _attr('colspan', s),
	for: (s: string) => _attr('for', s),
	role: (s: string) => _attr('role', s),
	arialabel: (s: string) => _attr('aria-label', s),
	arialive: (s: string) => _attr('aria-live', s),
	name: (s: string) => _attr('name', s),
	min: (s: string) => _attr('min', s),
	max: (s: string) => _attr('max', s),
	action: (s: string) => _attr('action', s),
	method: (s: string) => _attr('method', s),
	autocomplete: (s: string) => _attr('autocomplete', s),
	list: (s: string) => _attr('list', s),
	form: (s: string) => _attr('form', s),
	size: (s: string) => _attr('size', s),
}
const style = (x: {[k: string]: string | number}) => { return {_styles: x}}
const prop = (x: {[k: string]: any}) => { return {_props: x}}
