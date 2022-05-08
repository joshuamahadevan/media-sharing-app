const express=require('express')
const router=express.Router()
const User=require('../model/User')
const jwt=requier('jsonwebtoken')

router.use('/login', loginRouter)
router.use('/register', registerRouter)
router.get('/', (req,res)=> res.redirect('/login'))

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