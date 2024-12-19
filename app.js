require('dotenv').config({path: `${process.cwd()}/.env`});
const express = require('express');

const authRouter = require('./route/authRoute');
const catchAsync = require('./utils/catchAsync');
const AppError = require('./utils/appError');
const { stack } = require('sequelize/lib/utils');
const globalErrorHandler = require('./controller/errorController');

const app = express();

app.use(express.json())

// app.get('/',(req,res)=>{
//     res.status(200).json({
//         status: 'success',
//         message: 'Whoo! Rest Apis are working',
//     });
// });

// all routes will be here

app.use('/api/v1/auth',authRouter);


// app.use('*',async(req,res,next)=>{
//     return next(new Error('This is error'));
//     throw new Error('This is error');
//     res.status(404).json({
//         status:'fail',
//         message: 'Route not found'
//     });
// });

// app.use('*',async(req,res,next)=>{
//     return next(new Error('This is error'));
// });

app.use('*', catchAsync( async(req,res,next)=>{
    throw new AppError(`Can't find ${req.originalUrl} on this server`, 404);
})
);

// app.use((err,req,res,next)=>{
//     res.status(404).json({
//         status:'error',
//         message: err.message,
//     });
// })

// app.use((err,req,res,next)=>{
//     res.status(err.statusCode).json({
//         status:err.status,
//         message: err.message,
//         stack: err.stack
//     });
// })

app.use(globalErrorHandler);


const PORT = process.env.APP_PORT || 4000;

app.listen(PORT,()=>{
    console.log('Server up and running', PORT)
})