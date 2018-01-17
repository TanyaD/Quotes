var express = require("express");
var app = express();
var bodyParser = require("body-parser");
var mongoose = require('mongoose');
app.use(bodyParser.urlencoded({extended:true}));
app.set('views', __dirname+ '/views');
app.set('view engine', 'ejs');
var session = require('express-session');
app.use(session({secret:'codingdojo'}));

app.get('/',function(request,response){
    response.render("users")
})
app.get('/quotes',function(request,response){

    var mysort = { updatedAt: -1 }
    User.find({}).sort(mysort).exec(function(err,users){
    response.render("index",{"users":users})
    })
})
mongoose.connect('mongodb://localhost/basic_mongoose');
var UserSchema = new mongoose.Schema({
    name: {type:String, required:true, minlength:6},
    quote: {type:String, required:true, minlength:6}
},  {timestamps: true})
mongoose.model('User', UserSchema);
var User = mongoose.model('User')
mongoose.Promise = global.Promise;

app.post('/quotes', function(req,res){
    console.log("POST DATA", req.body);
    var user = new User({name:req.body.name, quote:req.body.quote});
    user.save(function(err){
        if (err){
            res.render('users', {errors:user.errors})
        }
        else{
            console.log("success");
            res.redirect('/quotes')
        }
    });
})
app.listen(8000, function(){
    console.log("listening on port 8000");
});