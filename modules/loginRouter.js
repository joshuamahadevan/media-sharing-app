const express=require('express')
const router=express.Router()

const bcrypt=require('bcryptjs')
const User=require('../model/User')
const {loginValidation} = require('./validation')
const jwt = require('jsonwebtoken')

router.post('/', async (req,res)=>{
    //validate before proceeding
    const {error}=loginValidation(req.body)
    if(error) res.status(400).send(error.details[0].message)

    //check if email exists
    const foundUser = await User.findOne({email:req.body.email})
    if(!foundUser) res.status(400).send('Email doesnt exists')

    //check if password is correct
    const validPass = await bcrypt.compare(req.body.password, foundUser.password)
    if(!validPass) res.status(400).send('Wrong Password')

    //create and sign token
    const token=jwt.sign({name: foundUser.name}, "top-secret")
    res.header('auth-token', token).send(token)
    
    //logged in
})