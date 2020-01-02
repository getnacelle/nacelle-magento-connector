import Dilithium from 'nacelle-connector/services/dilithium'
import { buildMutation } from 'nacelle-connector/utils/dilithium-helpers'

describe('Services / Dilithium Service', () => {

  const mockMutation = `mutation indexProducts($input: IndexProductsInput!) {
    indexProducts(input: $input) {
      count
      ids
    }
  }`

  describe('It creates a Dilithium Service', () => {

    const mockDomain = 'connector-test.getnacelle.com'
    const mockSpaceId = 99877
    const mockToken = '588383984-2444-2213-555432-455666677'

    const dilithium = new Dilithium(mockDomain, mockSpaceId, mockToken)

    const mockHeaders = {
      'org-id': mockSpaceId,
      token: mockToken
    }

    test('It set the Dilithium sync domain', () => {
      expect(dilithium.domain).toEqual(mockDomain)
    })

    test('It set the Dilithium sync SpaceId', () => {
      expect(dilithium.clientId).toEqual(mockSpaceId)
    })

    test('It set the Dilithium sync token', () => {
      expect(dilithium.clientToken).toEqual(mockToken)
    })

    test('It set the Dilithium sync headers', () => {
      expect(dilithium.authHeader).toEqual(mockHeaders)
    })

    test('It created a Dilithium mutation', () => {
      const mutation = buildMutation('indexProducts', 'IndexProductsInput')
      expect(JSON.stringify(mutation)).toEqual(JSON.stringify(mockMutation))
    })
    // const query = dilithium.buildQuery('pim', 'products', chunk, 'indexProducts', 'IndexProductsInput')
    // test('Dilithium create query', () => {

    // })

    // test('Dilithium save', () => {

    // })

  })
})
