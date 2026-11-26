import { nextTestSetup } from 'e2e-utils'
import { retry } from 'next-test-utils'

describe('use-cache-stale-revalidation', () => {
  const { next, isNextStart } = nextTestSetup({
    files: __dirname,
    env: { NEXT_PRIVATE_DEBUG_CACHE: '1' },
  })

  if (isNextStart) {
    it('regenerates an ISR page when its stale use-cache read joins a pending request', async () => {
      const initial = await next.fetch('/some-slug')
      expect(initial.status).toBe(200)
      await initial.text()

      // The static page was prerendered during the build, so populate the
      // runtime cache handler before invalidating the entry.
      const seeded = await next.fetch('/peek/some-slug')
      expect(seeded.status).toBe(200)
      const seededBody = await seeded.text()
      const cachedValue = seededBody.match(/some-slug:[^<]+/)?.[0] ?? ''
      expect(cachedValue).not.toBe('')

      expect(
        (
          await next.fetch('/revalidate', {
            method: 'POST',
          })
        ).status
      ).toBe(204)

      const outputStart = next.cliOutput.length
      const dynamicPage = next.fetch('/peek/some-slug')

      await retry(() => {
        expect(next.cliOutput.slice(outputStart)).toContain(
          'StaleCacheHandler::get-started'
        )
      })

      const { previewModeId } = await next.readJSON(
        '.next/server/preview-props.json'
      )
      const regenerated = await next.fetch('/some-slug', {
        headers: { 'x-prerender-revalidate': previewModeId },
      })

      expect(regenerated.status).toBe(200)
      await regenerated.text()
      const stale = await dynamicPage
      expect(stale.status).toBe(200)
      expect(await stale.text()).toContain(cachedValue)

      expect(next.cliOutput.slice(outputStart)).toContain(
        'joining pending cross-request invocation'
      )
    })
  }
})
