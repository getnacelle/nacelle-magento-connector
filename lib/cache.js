export default () => {
  const cache = new Map()
  const cleanup = 60 * 1000 // one min

  const cacheManager = {
    key(...args) {
      return args.join(':')
    },
    set(key, value) {
      const exists = cache.has(key)
      if (exists) {
        // throw new Error('Key already exists')
        return // die gracefully
      }
      cache.set(key)
      initSelfClean(key)
    },
    delete(key) {
      if (cache.has(key)) {
        cache.delete(key)
      }
    },
    get(key) {
      return cache.get(key)
    }
  }

  const initSelfClean = (key) => {
    setTimeout(() => {
      console.log('cleaning up', key)
      cacheManager.delete(key)
    }, cleanup)
  }

  return cacheManager
}
