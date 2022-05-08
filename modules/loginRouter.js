const express=require('express')
const router=express.Router()

const bcrypt=require('bcryptjs')
const User=require('../model/User')
const {loginValidation} = require('./validation')
const jwt = require('jsonwebtoken')

router.get('/', (req,res)=>{
    res.render('login')
})

router.post('/', async (req,res)=>{
    console.log(req.body)
    //validate before proceeding
    const {error}=loginValidation(req.body)
    if(error){
        res.status(400).render('error',{error:error.details[0].message})
        next()
    } 
    else{
        //check if email exists
        const foundUser = await User.findOne({email:req.body.email})
        if(!foundUser) {
            res.status(400).render('error',{error:'Email doesn\'t exists'})
            next()
        }
        else{
            //check if password is correct
            const validPass = await bcrypt.compare(req.body.password, foundUser.password)
            if(!validPass) {
                res.status(400).render('error',{error:'Wrong Password'})
                next()
            }else{
                //create and sign token
                const token=jwt.sign({name: foundUser.name}, "top-secret")
                res.cookie('auth', token)
                res.redirect('/')
                //logged in
            }
        }
    }
})

module.exports=router