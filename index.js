const express = require('express')
const dotenv = require('dotenv').config() //Used for loading || configure the env variables
const { errorHandler } = require('./middleware/errorHandler')
const connectDB = require('./config/db')
const cors = require('cors');
const userRoute = require('./routes/UserRoutes')
const inventoryRoutes = require('./routes/inventoryRoutes')
const app = express()
app.use(express.json())
app.use(express.urlencoded({ extended: false }))
app.use(errorHandler)

app.use(cors({
    origin: 'http://localhost:3000', // Allow requests from this origin
    credentials: true, // Enable credentials (cookies, authorization headers, etc.)
}));

const PORT = process.env.PORT || 5000

try {
    connectDB();
    app.listen(PORT, (req, res) => {
        console.log(`server is running on port ${PORT}`);
    })

} catch (error) {
    console.log("Something went wrong ");
}

// Simple route
app.get('/', (req, res) => {
    res.status(200).json({ message: `Welcome to server That is running on ${PORT} port` })
})

// route for user
app.use('/api/auth', userRoute)
// invetory routes
app.use('/api',inventoryRoutes )
