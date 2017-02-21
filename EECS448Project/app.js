var express = require("express");
var app = express();

app.get('/', function(req,res){
    res.sendFile(__dirname + "/Pages/" + "homepage.html");
});

app.get('/owner',function(req,res){
    res.sendFile(__dirname + "/Pages/" + "ownerpage.html");
});

app.get('/user',function(req,res){
    res.sendFile(__dirname + "/Pages/" + "userpage.html");
});

app.listen(3000, function(){
    console.log('EECS 448 project app listening on port 3000');
})