const assert = require('node:assert/strict')
const test = require('node:test')
const {buildSync} = require('esbuild')
const {mkdtempSync, rmSync} = require('node:fs')
const {tmpdir} = require('node:os')
const {join} = require('node:path')

const dir = mkdtempSync(join(tmpdir(), 'mox-pagination-'))
const output = join(dir, 'pagination.cjs')
buildSync({entryPoints: [join(__dirname, 'pagination.ts')], outfile: output, bundle: true, platform: 'node', format: 'cjs'})
const {queuePage, queueCursor} = require(output)
test.after(() => rmSync(dir, {recursive: true}))

for (const field of ['Submitted', 'Queued', 'NextAttempt', 'LastActivity']) {
	test(`preserves nanoseconds for ${field}, including tied timestamps`, async () => {
		const timestamps = ['2026-11-25T12:00:00.123456789Z', '2026-11-25T12:00:00.123456789Z', '2026-11-25T12:00:00.123456790Z']
		const raw = timestamps.map((timestamp, i) => ({ID: i + 1, [field]: timestamp}))
		const rows = await queuePage(Promise.resolve(raw), item => ({...item, [field]: new Date(item[field])}), field)
		assert.deepEqual(rows.map(queueCursor), timestamps)
		assert.equal(rows[0][field].toISOString(), '2026-11-25T12:00:00.123Z')
		assert.equal(raw[0][field], timestamps[0])
		assert.notEqual(queueCursor(rows[1]), queueCursor(rows[2]))
	})
}

test('accepts empty pages', async () => {
	for (const value of [null, []]) {
		assert.deepEqual(await queuePage(Promise.resolve(value), x => x, 'Submitted'), [])
	}
})

test('rejects malformed pages and missing cursors', async () => {
	await assert.rejects(queuePage(Promise.resolve({}), x => x, 'Submitted'), /Invalid queue page/)
	for (const value of [undefined, null, 123, 'not-a-date', new Date()]) {
		await assert.rejects(queuePage(Promise.resolve([{Submitted: value}]), x => x, 'Submitted'), /Invalid queue cursor/)
	}
	assert.throws(() => queueCursor({}), /Missing queue cursor/)
})

test('propagates API and record validation errors', async () => {
	await assert.rejects(queuePage(Promise.reject(new Error('network failed')), x => x, 'Submitted'), /network failed/)
	await assert.rejects(queuePage(Promise.resolve([{}]), () => { throw new Error('invalid record') }, 'Submitted'), /invalid record/)
})
