const port = 6969;
var express = require('express');
var app = express();
var bodyParser = require("body-parser")
var session = require('express-session');
var path = require("path")
app.use(express.static(path.join(__dirname, "./Frontend/public/dist/public")))
app.use(bodyParser.json())
app.use(session({
    secret: 'LoginReg',
    resave: false,
    saveUninitialized: true,
    cookie: { maxAge: 1800000 }
}));
app.get('/session', function(req,res){
    if(req.session.token === undefined){
        req.session.token = 0
    }
    res.json({token: req.session.token})
})
app.post('/session', function(req,res){
    req.session.token = req.body.token;
    res.json({token: req.session.token})
})
app.delete('/session', function(req,res){
    delete req.session.token;
    res.json({token: 0})
})
app.all("*", (req,res,next) => {
    res.sendFile(path.resolve("./Frontend/public/dist/public/index.html"))
});
app.listen(port, function() {
    console.log("listening on port", port);
})