# Checkout

`POST https://<connector>/<provider>/checkout/<cartId>`

`POST https://mymagentoconnector.com/checkout/MItLoYnYn9lzeZZfxsLbDYmhdKI5NdY8`

**Required Headers**
```
magento-host=https://mymagentostore.api
magento-token=15giJ8bNajOoxweiU4P6nqKRE5oG3bLG
```

**Payload**
```json
{
	"email": "youremail@gmail.com",
	"paymentMethod": {
		"method": "checkmo"
	}
}
```

**Response**

`@return {Number} A new Order ID`

```json
1
```