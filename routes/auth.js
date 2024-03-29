const router = require('express').Router();
const User = require('../models/User')
const { registerValidation, loginValidation } = require('../validation')
const jwt = require('jsonwebtoken')
const bcrypt = require('bcryptjs')   

router.post('/register' , async (req, res) => {

    // Lets validate data before we make user

    const { error } = registerValidation(req.body);
    if (error) {
        return res.status(400).send(error.details[0].message)
    }

    // check user already in db

    const emailExist = await User.findOne({ email: req.body.email })
    if (emailExist) {
        return res.status(400).send('Email already exist');
    }

    // hash password

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(req.body.password , salt)

    // create new user

    const user = new User({
        name : req.body.name,
        email : req.body.email,
        password : hashedPassword
    })
    try {
        const savedUser = await user.save();
        res.send({ user : user._id })
    } catch (error) {
        res.status(400).send(error)
    }
})

// Login

router.post('/login' , async (req, res) => {
    const { error } = loginValidation(req.body);
    if (error) {
        return res.status(400).send(error.details[0].message)
    }
    // check if email exist

    const user = await User.findOne({ email: req.body.email })
    if (!user) {
        return res.status(400).send('Email doesnt exist');
    }
    // password is correct?
    const validPassword = await bcrypt.compare(req.body.password , user.password)
    if (!validPassword) {
        return res.status(400).send('Invalid password!')
    }

    //  create and assign a token
    const token = jwt.sign({_id : user._id}, process.env.TOKEN_SECRET);
    res.header('auth-token', token).send(token);

})
    
module.exports = router;