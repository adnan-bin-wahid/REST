require('dotenv').config({path: `${process.cwd()}/.env`});
const user = require("../db/models/user");
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');

const generateToken = (payload) =>{
    return jwt.sign(payload,process.env.jWT_SECRET_KEY,{
        expiresIn: process.env.JWT_EXPIRES_IN,
    });
}

const signup =catchAsync( async (req,res,next)=>{
    const body = req.body;

    if(!['1','2'].includes(body.userType)){
        throw new AppError('Invalid User Type',400);
        // return res.status(400).json({
        //     status: 'fail',
        //     message: 'Invalid user Type'
        // });
    }

    const newUser = await user.create({
        userType: body.userType,
        firstName: body.firstName,
        lastName: body.lastName,
        email: body.email,
        password: body.password, 
        confirmPassword: body.confirmPassword,
    });

    if(!newUser){
        return next(new AppError('Failed to create the user',400));
        // return res.status(400).json({
        //     status: 'fail',
        //     message: 'Failed to create the user',
        // })
    }

    const result= newUser.toJSON()

    

    delete result.password;
    delete result.deletedAt;

    result.token = generateToken({
        id: result.id
    })


    

    return res.status(200).json({
        status: 'success',
        data: result,
    })

});

const login = catchAsync( async (req,res,next)=>{
    const {email,password} = req.body;

    if(!email || ! password){
        return next(new AppError('Please provide email and password',400));
        // return res.status(400).json({
        //     status: 'fail',
        //     message: 'Please provide email and password',
        // });
    }

    const result = await user.findOne({where: {email}});
    if(!result || !(await bcrypt.compare(password,result.password))){
        return next(new AppError('Incorrect email or password',401));
        // return res.status(401).json({
        //     status: 'fail',
        //     message: 'Incorrect email or password',
        // });
    }

    const token = generateToken({
        id: result.id,
    });

    return res.status(200).json({
        status: 'success',
        token
    });
});

module.exports = { signup, login }