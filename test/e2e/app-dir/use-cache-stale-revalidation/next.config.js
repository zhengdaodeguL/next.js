/**
 * @type {import('next').NextConfig}
 */
module.exports = {
  cacheComponents: true,
  cacheHandlers: {
    default: require.resolve('./cache-handler.js'),
  },
}
