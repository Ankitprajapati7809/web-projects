module.exports = function wrapAysnc(fn){
    return function(req,resp,next){
        fn(req,resp,next).catch((err)=>next(err));
    }

}