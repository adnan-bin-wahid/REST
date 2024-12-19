// const catchAsync = (fn) => {
//     const errorHandler = (req,res,next) => {
//         fn(req,res,next).catch((err)=> next(err))
//     }
// }

const catchAsync = (fn) => {
    const errorHandler = (req,res,next) => {
        fn(req,res,next).catch(next)
    }

    return errorHandler;
}

module.exports = catchAsync;