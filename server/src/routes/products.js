const Router = require('express')

const productController = require('../controller/productController')

const products = Router()

products.get('/getProducts', productController.fetchProducts)
products.put('/bulk-update-segment', productController.updateTags)
products.get('/coverage', productController.getCoverageData)

module.exports = products