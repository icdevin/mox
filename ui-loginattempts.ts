import {dom, attr, ElemArg} from './lib'
import {detailLine} from './ui'

interface LoginAttempt {
	Last: Date
	First: Date
	Count: number
	AccountName: string
	LoginAddress: string
	Protocol: string
	AuthMech: string
	UserAgent: string
	RemoteIP: string
	LocalIP: string
	TLS: string
	TLSPubKeyFingerprint: string
	Result: string
}

export const loginAttemptsTable = (accountLinks: boolean, loginAttempts: LoginAttempt[], age: (date: Date) => ElemArg) => {
	// todo: search

	return dom.table(
		dom._class('loginAttemptsTable'),
		dom.thead(
			dom.tr(
				dom.th('Time'),
				dom.th('Result'),
				dom.th(dom._class('alignRight', 'loginAttemptsCount'), 'Count'),
				dom.th('Account'),
				dom.th('Client'),
				dom.th('Connection'),
			),
		),
		dom.tbody(
			loginAttempts.length ? [] : dom.tr(dom.td(attr.colspan('6'), 'No login attempts in past 30 days.')),
			loginAttempts.map(la =>
				dom.tr(
					dom.td(
						detailLine('Last', age(la.Last)),
						detailLine('First', age(la.First)),
					),
					dom.td(la.Result === 'ok' ? la.Result : dom.span(dom._class('uiBadge', 'uiBadgeError'), la.Result)),
					dom.td(dom._class('alignRight'), ''+la.Count),
					dom.td(
						accountLinks ? dom.a(attr.href('#accounts/l/'+la.AccountName+'/loginattempts'), la.AccountName) : la.AccountName,
						detailLine('Address', la.LoginAddress),
					),
					dom.td(
						detailLine('Protocol', la.Protocol),
						detailLine('Mechanism', la.AuthMech),
						detailLine('User agent', la.UserAgent),
					),
					dom.td(
						detailLine('Remote IP', la.RemoteIP),
						detailLine('Local IP', la.LocalIP),
						detailLine('TLS', la.TLS),
						detailLine('TLS pubkey fingerprint', la.TLSPubKeyFingerprint),
					),
				),
			),
		),
	)
}
