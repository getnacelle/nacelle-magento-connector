import StoreConfig from '../../../test/fixtures/store-config.json'
import Cart from '../../../test/fixtures/cart.json'
import PaymentMethods from '../../../test/fixtures/payment-methods.json'
import ShippingMethods from '../../../test/fixtures/shipping-methods.json'
import Address from '../../../test/fixtures/address.json'
import CartTotalRequest from '../../../test/fixtures/total-request.json'
import CartTotalResponse from '../../../test/fixtures/cart-total.json'
import Order from '../../../test/fixtures/order-response.json'
import CheckoutRequest from '../../../test/fixtures/checkout-request.json'

const testCartId = 'O9ZAeN2OscUkqIThqQpuciscNojHkpfO'

const itemsInsert = {
	"items": [{
		"sku": "24-MB01",
		"qty": 6
	}]
}

const itemAdded = [
    {
        "item_id": 4,
        "sku": "24-MB01",
        "qty": 6,
        "name": "Joust Duffle Bag",
        "price": 34,
        "product_type": "simple",
        "quote_id": "3"
    }
]

export const fixtures = {
    itemsInsert,
    itemAdded,
    cartId: testCartId,
    storeConfig: StoreConfig,
    cart: Cart,
    paymentMethods: PaymentMethods,
    shippingMethods: ShippingMethods,
    address: Address,
    cartTotal: CartTotalResponse,
    totalRequest: CartTotalRequest,
    order: Order,
    checkout: CheckoutRequest
}

export default class Magento {

    async createCart() {
        return this.request('cartId')
    }

    async getCart(cartId) {
        return this.request('cart')
    }

    async cartAddItem(cartId, item) {
        return this.request('itemAdded')
    }

    async cartUpdateItem(cartId, itemId, item) {
        return this.request('itemAdded')
    }

    async cartRemoveItem(cartId, itemId) {
        return this.request('itemAdded')
    }

    async getStoreConfig() {
        return this.request('storeConfig')
    }

    async getPaymentMethods(cartId) {
        return this.request('paymentMethods')
    }

    async getShippingMethodsByAddress(cartId, address) {
        return this.request('shippingMethods')
    }

    async setCartInfo(cartId, info) {
        return this.request('cartTotal')
    }

    async createOrder(cartId, paymentInfo) {
        return 1
    }

    async getOrder(orderId) {
        return this.request('order')
    }

    async request(fixture) {
        return fixtures[fixture]
    }
}