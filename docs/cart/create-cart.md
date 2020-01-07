# Create a Cart with Items

`POST https://<connector>/<provider>/cart`

`POST https://mymagentoconnector.com/magento/cart`

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
		"qty": 4
	}]
}
```

**Response**

`@return {String} Cart ID`

```
MItLoYnYn9lzeZZfxsLbDYmhdKI5NdY8
```