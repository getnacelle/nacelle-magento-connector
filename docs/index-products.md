# Products

## Request URL

```bash
https://connector-host.io/magento/index-products
```

## Body Params

```json
{
  "defaultLocale": "en-us",
  "defaultCurrencyCode": "USD",
  "limit": 25
}

```

- Default Locale: `en-us` - if the Magento store does not provide this, set as default
- Default Currency Code: `USD` - default if not present in Magento config
- Limit: `300` - batch size for indexing products