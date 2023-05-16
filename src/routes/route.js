const express = require('express');
const app = express();
const router = express.Router();
const controller = require('../application/controller/controller-toko')
const multer = require('multer');
const path = require('path')

const upload = multer({ dest : path.resolve('./tmp')})

router.post('/add-product', controller.addProduct)
router.get('/get-product', controller.getProduct)
router.get('/get-product/:id', controller.getProductById)
router.put('/update-product/:id', controller.updateProductById)
router.put('/add-product-image/:id', upload.single('image'), controller.addProductImage)
router.delete('/delete-product/:id', controller.deleteProductById)

module.exports = router;