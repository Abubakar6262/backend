const express = require('express')
const { registerUser, loginUser, forgotPassword, updatePassword } = require('../controller/userController')
const router = express.Router()

// for get request
router.get('/', (req, res) => {
    res.status(200).json({ message: "welcome to user route" })
})

// for Register User
router.post('/register',registerUser)

// For Login User
router.post('/login', loginUser)

// For forgot password
router.post('/forgotpassword', forgotPassword)

// For update password
router.put('/updatepassword', updatePassword)





module.exports = router