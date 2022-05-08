const express=require('express')
const router=express.Router()

const mongoose=require('mongoose')
const bcrypt=require('bcryptjs')
const User=require('../model/User')
const {registerValidation} = require('./validation')

router.get('/', (req,res)=>{
    res.render('register')
})

router.post('/', async (req,res, next)=>{
    //validate user before saving
    const {error}=registerValidation(req.body)
    if(error) {
        res.status(400).send(error.details[0].message)
        next()
    }
    console.log('validated')

    //check for duplicates
    const emailExists = await User.findOne({email:req.body.email})
    console.log(emailExists)
    if(emailExists) {
        res.status(400).send('Email already exists')
        next()
    }else{
        console.log('checked for duplicates')

        //Hash password
        const salt= await bcrypt.genSalt(10)
        const hashedPassword=await bcrypt.hash(req.body.password, salt) 
        console.log('hashed password')

        //create new user
        const user= new User({
            name: req.body.name,
            email: req.body.email,
            password: hashedPassword
        })
        console.log('saving user')
        //save to database
        try{
            const savedUser= await user.save();
            res.redirect('/auth/login')
        }catch(err){
            res.status(400).send(err)
        }
    }

})

module.exports=router