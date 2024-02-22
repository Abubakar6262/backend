const mongoose = require('mongoose')


const userSchema = mongoose.Schema({
    username: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: [true, 'Please enter user name'],
        unique: true,
    },
    gender: {
        type: String,
        required: [true, 'Please select gender'],
    },
    country: {
        type: String,
        required: [true, 'Please enter country'],
    },
    city: {
        type: String,
        required: [true, 'Please enter city'],
    },
    dob: {
        type: String,
        required: [true, 'Please enter Date of birth'],
    },
    password: {
        type: String,
        required: [true, 'Please enter password'],
    },
    role: {
        type: String,
        required: [true, 'Roll can not defined'],
    },
    createdAt: {
        type: Date,
        default: Date.now()
    },

})

module.exports = mongoose.model('users', userSchema)