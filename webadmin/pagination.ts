// Keeps database cursor precision that JavaScript Dates cannot represent.
const cursors = new WeakMap<object, string>()

export const queuePage = async <T extends object>(request: Promise<T[] | null>, parse: (raw: unknown) => T, field: string): Promise<T[]> => {
	const rows = await request
	if (rows === null) {
		return []
	}
	if (!Array.isArray(rows)) {
		throw new Error('Invalid queue page')
	}
	return rows.map(raw => {
		const item = parse(raw)
		const cursor = (raw as Record<string, unknown>)[field]
		if (typeof cursor !== 'string' || !Number.isFinite(Date.parse(cursor))) {
			throw new Error('Invalid queue cursor timestamp')
		}
		cursors.set(item, cursor)
		return item
	})
}

export const queueCursor = (item: object): string => {
	const cursor = cursors.get(item)
	if (cursor === undefined) {
		throw new Error('Missing queue cursor timestamp')
	}
	return cursor
}
