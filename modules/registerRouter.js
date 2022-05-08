const express=require('express')
const router=express.Router()

const mongoose=require('mongoose')
const bcrypt=require('bcryptjs')
const User=require('../model/User')
const {registerValidation} = require('./validation')

router.post('/', async (req,res)=>{
    //validate user before saving
    const {error}=registerValidation(req.body)
    if(error) res.status(400).send(error.details[0].message)

    //check for duplicates
    const emailExists = await User.findOne({email:req.body.email})
    if(emailExists) res.status(400).send('Email already exists')

    //Hash password
    const salt= await bcrypt.genSalt(10)
    const hashedPassword=await bcrypt.hash(req.body.password, salt) 

    //create new user
    const user= new User({
        name: req.body.name,
        email: req.body.email,
        password: hashedPassword
    })

    //save to database
    try{
        const savedUser= await user.save();
        res.send({user: savedUser._id})
    }catch(err){
        res.status(400).send(err)
    }
})