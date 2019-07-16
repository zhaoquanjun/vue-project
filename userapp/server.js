let express  = require('express');


let app = express();
app.use('*', function (req, res, next) {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Headers', 'Content-Type');
    res.header('Access-Control-Allow-Methods', '*');
    res.header('Content-Type', 'application/json;charset=utf-8');
    next();
});
app.get('/login',(req,res)=>{
    console.log("login")
    res.json({
        name: "赵祥兵123",
        age:18
    })
})
app.listen(3000,function(){
    console.log("start")
});