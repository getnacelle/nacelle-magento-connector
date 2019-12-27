import Cache, { initSelfClean } from '../../cache'
import ERRORS from '../../errors'

describe('Cache / Internal', () => {
  const _cache = Cache()

  const testKey = 'job:runner'

  test('It creates a cache key', () => {
    expect(_cache.key('job', 'runner')).toEqual(testKey)
  })

  test('It sets a cached ref by key', () => {
    const testValue = 'test'
    const key = _cache.key('job', 'runner')
    _cache.set(key, testValue)
    const found = _cache.get(key)
    expect(found).toEqual(testValue)
  })

  test('It errors that cache key exists', () => {
    const testValue = 'error test'
    try {
      _cache.set(testKey, testValue)
    } catch(e) {
      expect(e.message).toBe(ERRORS.cacheKeyExists)
    }
  })

  test('It deletes a cached ref by key', () => {
    _cache.delete(testKey)
    const ref = _cache.get(testKey)
    expect(ref).toBeUndefined()
  })

  test('It cannot delete cached ref becasue key does not exist', () => {
    try {
      _cache.delete(testKey)
    } catch(e) {
      expect(e.message).toBe(ERRORS.cacheKeyDoesNotExist)
    }
  })

  test('It has ref in cache by key', () => {
    const testValue = 'has ref test'
    _cache.set(testKey, testValue)
    const ref = _cache.has(testKey)
    expect(ref).toBeDefined()
    _cache.delete(testKey)
  })

  test('It initiates self cleaning by key', async () => {
    const testValue = 'init self clean'
    // set the cache, set the autoclean to false
    _cache.set(testKey, testValue, false)
    const cleaned = await initSelfClean(testKey, 0)
  })

})