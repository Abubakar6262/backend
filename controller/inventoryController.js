const express = require('express');
const bodyParser = require('body-parser');
const uuid = require('uuid');
const InventoryItem = require('../models/inventoryModel');
const fs = require('fs').promises;
// For all products Read
const readInventrory = async (req, res) => {
    try {
        const allProducts = await InventoryItem.find({});
        if (allProducts) {
            return res.status(200).json({ message: 'All products are', allProducts })
        } else {
            return res.status(400).json({ message: 'There is no product yet...' })
        }

    } catch (error) {
        res.status(500).json({ message: 'server error', error })
    }
}

// For adding inventory------
const addInventory = async (req, res) => {
    try {
        const { quantity, title, market_price, cost_price, inventory_type, minimum_age } = req.body;
        const imagePath = req.file.filename;
        console.log('Image path is ===>', imagePath)

        // Validate request body----
        if (!quantity || !title || !market_price || !cost_price || !inventory_type) {
            return res.status(400).json({ error: 'Missing required fields' });
        }

        // Generate unique ID for the new item-----
        const id = uuid.v4();

        // Create new inventory item------
        const newItem = {
            id,
            quantity,
            title,
            image: imagePath,
            market_price,
            cost_price,
            margin: parseFloat((market_price - cost_price).toFixed(2)),
            inventory_type,
            minimum_age
        };

        // Add item to inventory----- 
        await InventoryItem.create(newItem);

        return res.status(200).json({ message: 'Inventory item added successfully', item: newItem });
    } catch (err) {
        console.log('Oops...! Something went wrong ', err);
        return res.status(500).json({ error: 'Internal server error' });
    }
};

// For deleting inventory----
const delInventory = async (req, res) => {
    try {
        const { id } = req.query;

        // find index --
        const deletedItem = await InventoryItem.findOneAndDelete({ id });
        // console.log("You deleted this item ===>", deletedItem);
        const imageName = deletedItem.image;

        if (!deletedItem) {
            return res.status(400).json({ message: "Product not exist" })
        }
        // Also delete image of product
        const imagePath = `uploads/products/${imageName}`;
        await fs.unlink(imagePath)

        return res.status(200).json({ message: 'Inventory item deleted successfully', deletedItem });
    } catch (err) {
        console.log('Oops...! Something went wrong ', err);
        return res.status(500).json({ error: 'Internal server error' });
    }
};
const updateInventory = async (req, res) => {
    try {
        return res.status(200).json({ message: 'Product Updated successfully' })
    } catch (error) {
        return res.status(500).json({ message: 'Server issue' })
    }
}


module.exports = {
    addInventory,
    delInventory,
    readInventrory,
    updateInventory,
};
