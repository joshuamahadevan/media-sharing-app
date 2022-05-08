const Joi=require('joi')

const registerValidation = (data)=>{
    const registerSchema=Joi.object({
        name: Joi
            .string()
            .alphanum()
            .min(6)
            .max(255)
            .required(),
        email: Joi
            .string()
            .min(6)
            .max(255)
            .required()
            .email(),
        password: Joi
            .string()
            .min(6)
            .required()
    })
    return registerSchema.validate(data)
}

const loginValidation = (data)=>{
    const loginSchema=Joi.object({
        email: Joi
            .string()
            .min(6)
            .max(255)
            .required()
            .email(),
        password: Joi
            .string()
            .min(6)
            .required()
    })

    return loginSchema.validate(data) 
}

module.exports = { registerValidation, loginValidation }