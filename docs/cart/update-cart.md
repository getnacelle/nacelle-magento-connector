# Update Items in Cart

`PUT https://<connector>/<provider>/cart/<cartId>`

`PUT https://mymagentoconnector.com/magento/cart/MItLoYnYn9lzeZZfxsLbDYmhdKI5NdY8`

**Required Headers**
```
magento-host=https://mymagentostore.api
magento-token=15giJ8bNajOoxweiU4P6nqKRE5oG3bLG
```

**Payload**
```json
{
	"items": [{
		"sku": "24-MB01",
		"qty": 2
	}]
}
```

**Response**
```json
[
    {
        "item_id": 4,
        "sku": "24-MB01",
        "qty": 2,
        "name": "Joust Duffle Bag",
        "price": 34,
        "product_type": "simple",
        "quote_id": "3"
    }
]
```