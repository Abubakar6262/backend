const userModel = require('../models/userModel');
const asynchandler = require('express-async-handler');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const secretKey = process.env.JWT_SECRET_KEY;
const randomString = require('randomstring');
const nodemailer = require('nodemailer');

//User Registraion Controller
const registerUser = asynchandler(async (req, res) => {
    // console.log('Registraion is running', req.body);
    const user = req.body

    //Hash password
    const salt = bcrypt.genSaltSync(10);
    const hashPassword = bcrypt.hashSync(user.password, salt);
    user.password = hashPassword;
    console.log("User for registraion", user);

    // Check Email 
    const checkEmail = await userModel.findOne({ email: user.email }).exec();
    if (checkEmail) {
        return res.status(400).json({ message: "You have already an account on this Email" })
    }
    // Check username 
    const checkUserName = await userModel.findOne({ username: user.username }).exec();
    if (checkUserName) {
        return res.status(400).json({ message: "User Name already exist plaese change it" })
    }

    // Insert data into DB
    try {
        await userModel.create(user)
        res.status(200).json({
            message: "Registraion successfully completed"
        })
    } catch (error) {
        console.log(error);
        res.status(400).json({
            message: "Registraion cannot completed"
        })

    }

})

// User Login Controller
const loginUser = asynchandler(async (req, res) => {
    const user = req.body
    // console.log("login function and user data is ", user);

    // Check email 
    const findUser = await userModel.findOne({ email: user.email }).exec();
    if (!findUser) {
        return res.status(400).json({ message: "You don not have an account" })
    }

    // Check password
    const comparePassword = await bcrypt.compare(user.password, findUser.password);
    if (!comparePassword) {
        return res.status(400).json({ message: "Invalid Password" })
    }

    // Token genrating and sending
    try {
        const tokenData = {
            id: findUser._id,
            email: findUser.email,
            username: findUser.username,
            role: findUser.role
        }
        const token = jwt.sign({ tokenData }, secretKey, { expiresIn: '30d' })
        return res.status(200).json({ token: token,message: "Login successfully" })
    } catch (error) {
        console.log(error);
        return res.status(400).json({ message: "somthing went wrong" })
    }
})

// Controller for forgot password
const forgotPassword = asynchandler(async (req, res) => {
    try {

        const { email } = req.body;
        // Check email 
        const findUser = await userModel.findOne({ email }).exec();
        if (!findUser) {
            return res.status(400).json({ message: "You don not have an account" })
        }
        // TemporaryPassword genrated
        const temporaryPassword = randomString.generate(7);
        //Hash password
        const salt = bcrypt.genSaltSync(10);
        const hashPassword = bcrypt.hashSync(temporaryPassword, salt);
        // Update user's password with the temporary password
        findUser.password = hashPassword;
        await findUser.save();

        // sending mail to user with TemporaryPassword
        await sendEmail(email, temporaryPassword);
        return res.status(200).json({ message: "password is sent on your email" })

    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: 'Internal server error' });
    }
})

// controler for update password
const updatePassword = asynchandler(async (req, res) => {
    try {

        const { password, email } = req.body
        // Find user by id
        const findUser = await userModel.findOne({ email }).exec();
        if (!findUser) {
            return res.status(400).json({ message: "Somthing went wrong" })
        }
        //Hash password
        const salt = bcrypt.genSaltSync(10);
        const hashPassword = bcrypt.hashSync(password, salt);
        // Update user's password
        findUser.password = hashPassword;
        await findUser.save();
        return res.status(200).json({ message: "Your password is updated successfully" })
    } catch (error) {
        console.log('somthing went wrong ==>', error)
    }
})

// My helper function for sending email
const sendEmail = async (email, temporaryPassword) => {
    try {
        // Create a Nodemailer transporter
        const transporter = nodemailer.createTransport({
            // host: 'smtp.ethereal.email',
            // port: 587,
            // auth: {
            //     user: 'virginia.jast@ethereal.email',
            //     pass: 'MPQXZTADN5ghzd6C4g'
            // }
            host: 'smtp.forwardemail.net',
            port: 587,
            auth: {
                user: 'm.nasir712.d@gmail.com',
                pass: 'dind ivct iyml ttim'
            }
        });

        // Send email with the temporary password
        await transporter.sendMail({
            from: 'virginia.jast@ethereal.email',
            to: email,
            subject: 'Temporary Password for Resetting Your Password',
            text: `Your temporary password is: ${temporaryPassword}. Please use this temporary password to log in and reset your password.`
        });
        console.log('Email sent successfully');
    } catch (error) {
        console.error('Error sending email:', error);
        throw error;
    }
}
module.exports = {
    registerUser,
    loginUser,
    forgotPassword,
    updatePassword,
}