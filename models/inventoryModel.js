const { Schema, model } = require('mongoose');

// Define inventory item schema
const inventoryItemSchema = new Schema({
    id: {
        type: String,
        required: true,
        unique: true
    },
    quantity: {
        type: Number,
        required: true
    },
    title: {
        type: String,
        required: true
    },
    image: {
        type: String, // --> String to store image path in image
        required: true,
    },
    market_price: {
        type: Number,
        required: true
    },
    cost_price: {
        type: Number,
        required: true
    },
    margin: {
        type: Number,
        required: true
    },
    inventory_type: {
        type: String,
        required: true
    },
    minimum_age: {
        type: Number
    }
});

// Create model from schema
const InventoryItem = model('InventoryItem', inventoryItemSchema);

module.exports = InventoryItem;
