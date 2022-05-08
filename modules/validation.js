const Joi=require('joi')

const registerValidation = (data)=>{
    const registerSchema={
        name: Joi
            .string()
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
    }   
    return Joi.validate(data, registerSchema) 
}

const loginValidation = (data)=>{
    const loginSchema={
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
    }   
    return Joi.validate(data, loginSchema) 
}

module.exports = { registerValidation, loginValidation }