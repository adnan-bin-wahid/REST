const signup =(req,res,next)=>{
    res.json({
        status: 'success',
        message: 'Sing up route are wonking',
    });
};

module.exports = { signup }