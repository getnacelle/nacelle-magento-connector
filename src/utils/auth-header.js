export default (req) => ({
  Authorization: `Bearer ${req.headers['magento-token']}`
})
