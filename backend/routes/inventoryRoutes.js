const express = require('express');
const multer = require('multer');
const router = express.Router()
const { addInventory, delInventory, readInventrory,updateInventory } = require('../controller/inventoryController.js')



// Set up storage for uploaded images
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/products');
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + '-' + file.originalname); //cd ==> colback function
    },
});

const upload = multer({ storage });

// Read all Inventro----
router.get('/products', readInventrory)

// for adding inventory----
router.post('/addInventory', upload.single('imageurl'), addInventory)
// for deleting inventory---
router.delete('/delInventory', delInventory)
// For Update inventory
router.put('/update', updateInventory)

module.exports = router