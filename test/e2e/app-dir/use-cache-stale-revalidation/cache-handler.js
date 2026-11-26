const defaultCacheHandler =
  require('next/dist/server/lib/cache-handlers/default.external').default

/** @type {import('next/cache').CacheHandler} */
module.exports = {
  async get(cacheKey, softTags) {
    const entry = await defaultCacheHandler.get(cacheKey, softTags)

    if (entry?.revalidate === -1) {
      console.log('StaleCacheHandler::get-started')
      await new Promise((resolve) => setTimeout(resolve, 2000))
    }

    return entry
  },

  set(cacheKey, pendingEntry) {
    return defaultCacheHandler.set(cacheKey, pendingEntry)
  },

  refreshTags() {
    return defaultCacheHandler.refreshTags()
  },

  getExpiration(tags) {
    return defaultCacheHandler.getExpiration(tags)
  },

  updateTags(tags, durations) {
    return defaultCacheHandler.updateTags(tags, durations)
  },
}
