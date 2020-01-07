# Get Cart Total

`POST https://<connector>/<provider>/cart/<cartId>/total`

`POST https://mymagentoconnector.com/magento/cart/MItLoYnYn9lzeZZfxsLbDYmhdKI5NdY8/total`

**Required Headers**
```
magento-host=https://mymagentostore.api
magento-token=15giJ8bNajOoxweiU4P6nqKRE5oG3bLG
```

**Payload**
```json
{
  "addressInformation": {
  	"billing_address": {
	    "region": "string",
	    "region_id": 12,
	    "region_code": "CA",
	    "country_id": "US",
	    "street": [
	      "Street Address"
	    ],
	    "postcode": "00000",
	    "city": "City",
        "firstname": "First Name",
        "lastname": "Last Name",
    	"telephone": "5555555555",
        "email": "youremail@gmail.com",
	    "save_in_address_book": 0
  	},
  	"shipping_address": {
	    "region": "string",
	    "region_id": 12,
	    "region_code": "CA",
	    "country_id": "US",
	    "street": [
	      "Street Address"
	    ],
	    "postcode": "00000",
	    "city": "City",
        "firstname": "First Name",
        "lastname": "Last Name",
    	"telephone": "5555555555",
        "email": "youremail@gmail.com",
	    "same_as_billing": 1,
	    "save_in_address_book": 0
  	},
  	"shipping_method_code": "flatrate",
    "shipping_carrier_code": "flatrate"
  }
}
```

**Response**

`@return {Object} Payment Methods, Totals, Cart Items`

```json
{
    "payment_methods": [
        {
            "code": "checkmo",
            "title": "Check / Money order"
        }
    ],
    "totals": {
        "grand_total": 156,
        "base_grand_total": 156,
        "subtotal": 136,
        "base_subtotal": 136,
        "discount_amount": 0,
        "base_discount_amount": 0,
        "subtotal_with_discount": 136,
        "base_subtotal_with_discount": 136,
        "shipping_amount": 20,
        "base_shipping_amount": 20,
        "shipping_discount_amount": 0,
        "base_shipping_discount_amount": 0,
        "tax_amount": 0,
        "base_tax_amount": 0,
        "weee_tax_applied_amount": null,
        "shipping_tax_amount": 0,
        "base_shipping_tax_amount": 0,
        "subtotal_incl_tax": 136,
        "shipping_incl_tax": 20,
        "base_shipping_incl_tax": 20,
        "base_currency_code": "USD",
        "quote_currency_code": "USD",
        "items_qty": 4,
        "items": [
            {
                "item_id": 1,
                "price": 34,
                "base_price": 34,
                "qty": 4,
                "row_total": 136,
                "base_row_total": 136,
                "row_total_with_discount": 0,
                "tax_amount": 0,
                "base_tax_amount": 0,
                "tax_percent": 0,
                "discount_amount": 0,
                "base_discount_amount": 0,
                "discount_percent": 0,
                "price_incl_tax": 34,
                "base_price_incl_tax": 34,
                "row_total_incl_tax": 136,
                "base_row_total_incl_tax": 136,
                "options": "[]",
                "weee_tax_applied_amount": null,
                "weee_tax_applied": null,
                "name": "Joust Duffle Bag"
            }
        ],
        "total_segments": [
            {
                "code": "subtotal",
                "title": "Subtotal",
                "value": 136
            },
            {
                "code": "shipping",
                "title": "Shipping & Handling (Flat Rate - Fixed)",
                "value": 20
            },
            {
                "code": "tax",
                "title": "Tax",
                "value": 0,
                "extension_attributes": {
                    "tax_grandtotal_details": []
                }
            },
            {
                "code": "grand_total",
                "title": "Grand Total",
                "value": 156,
                "area": "footer"
            }
        ]
    }
}
```