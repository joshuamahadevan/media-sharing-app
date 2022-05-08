const express=require('express')
const router=express.Router()
const User=require('../model/User')
const jwt=require('jsonwebtoken')
const loginRouter=require('./loginRouter')
const registerRouter=require('./registerRouter')

router.use('/login', loginRouter)
router.use('/register', registerRouter)
router.get('/', (req,res)=> res.redirect('auth/login'))

const verify = (req,res,next)=>{
    const token=req.header('auth-token')
    if(!token) return res.status(401).send('Access Denied')

    try{
        const verified=jwt.verify(token, "top-secret");
        if(verified)  req.user=verified 
        next()
    }catch(err){
        res.status(400).send('Invalid Token')
    }
}

module.exports={
    authRouter:router,
    verify: verify
}