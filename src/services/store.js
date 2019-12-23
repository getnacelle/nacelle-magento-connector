import uuid from 'uuid'

import productNormalizer from '../normalizers/product'
import collectionNormalizer from '../normalizers/collection'
import pageNormalizer from '../normalizers/page'

import appConfig, { app } from '../../config/app'
import Magento from '../services/magento'
import Dilithium from '../services/dilithium'

import { slugify } from '../utils/string-helpers'

const IGNORE_CATEGORIES = ['Root Catalog', 'Default Category']

export default class Store {

  constructor({
    name,
    orgId,
    orgToken,
    pimSyncSourceDomain,
    magentoToken,
    magentoEndpoint,
    defaultLocale,
    defaultCurrencyCode
  }) {
    this._id = uuid.v4()
    this.name = name
    this.secure = appConfig.environment === 'production'
    this.locale = defaultLocale
    this.currencyCode = defaultCurrencyCode

    this.magento = new Magento(magentoEndpoint, magentoToken)
    this.dilithium = new Dilithium(pimSyncSourceDomain, orgId, orgToken)

    this.configureMagento = this.configureMagento.bind(this)

    this.settings = {}
  }

  get id() {
    return this._id
  }

  async configureMagento() {
    const storeConfig = await this.magento.getStoreConfig()
    return this.settings.magento = {
      locale: slugify(storeConfig.locale),
      currencyCode: storeConfig.base_currency_code,
      mediaUrl: this.secure ? storeConfig.base_media_url : storeConfig.secure_base_media_url,
      staticUrl: this.secure ? storeConfig.base_static_url : storeConfig.secure_base_static_url,
      baseUrl: this.secure ? storeConfig.base_url : storeConfig.secure_base_url
    }
  }
}
