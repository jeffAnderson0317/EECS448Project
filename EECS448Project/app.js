var express = require("express");
var app = express();

//Get homepage and send it to whoever is requesting the page.
app.get('/', function(req,res){
    res.sendFile(__dirname + "/Pages/" + "homepage.html");
});

//Get owner page and send it to whoever is requesting the page.
app.get('/owner',function(req,res){
    res.sendFile(__dirname + "/Pages/" + "ownerpage.html");
});

//Get user page and send it to whoever is requesting the page.
app.get('/user',function(req,res){
    res.sendFile(__dirname + "/Pages/" + "userpage.html");
});

//Get listen for any requests on port 3000.
app.listen(3000, function(){
    console.log('EECS 448 project app listening on port 3000');
})