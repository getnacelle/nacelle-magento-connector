# Get Shipping Methods

`POST https://<connector>/<provider>/cart/<cartId>/shipping-methods`

`POST https://mymagentoconnector.com/magento/cart/MItLoYn...KI5NdY8/shipping-methods`

**Required Headers**
```
magento-host=https://mymagentostore.api
magento-token=15giJ8bNajOoxweiU4P6nqKRE5oG3bLG
```

**Payload**
```json
{
  "address": {
    "region": "California",
    "region_id": 12,
    "region_code": "CA",
    "country_id": "US",
    "street": [
      "Street Address"
    ],
    "postcode": "91607",
    "city": "City"
  }
}
```

**Response**

`@return {Array} A list of Shipping Methods`

```json
[
    {
        "carrier_code": "flatrate",
        "method_code": "flatrate",
        "carrier_title": "Flat Rate",
        "method_title": "Fixed",
        "amount": 20,
        "base_amount": 20,
        "available": true,
        "error_message": "",
        "price_excl_tax": 20,
        "price_incl_tax": 20
    },
    {
        "carrier_code": "tablerate",
        "method_code": "bestway",
        "carrier_title": "Best Way",
        "method_title": "Table Rate",
        "amount": 0,
        "base_amount": 0,
        "available": true,
        "error_message": "",
        "price_excl_tax": 0,
        "price_incl_tax": 0
    }
]
```