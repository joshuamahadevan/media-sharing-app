const express=require('express')
const router=express.Router()
const User=require('../model/User')
const jwt=require('jsonwebtoken')
const loginRouter=require('./loginRouter')
const registerRouter=require('./registerRouter')

router.use('/login', loginRouter)
router.use('/register', registerRouter)
router.get('/', (req,res)=> res.redirect('auth/login'))
router.get('/logout', (req,res) => {
    res.clearCookie('auth')
    res.redirect('/')
})

const verify = (req,res,next)=>{
    const token=req.cookies.auth
    if(!token) return res.status(401).render('pleaselogin')

    try{
        const verified=jwt.verify(token, "top-secret");
        if(verified)  req.user=verified 
        next()
    }catch(err){
        res.status(400).redirect('https://youtube.com/shorts/TTibfbEkoQ0?feature=share')
    }
}

module.exports={
    authRouter:router,
    verify: verify
}