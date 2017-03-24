var express = require("express");
var app = express();

app.use('/images', express.static(__dirname + '/images'));
app.use('/js', express.static(__dirname + '/js'));
app.use('/css', express.static(__dirname + '/css'));

//Get homepage and send it to whoever is requesting the page.
app.get('/', function(req,res){
    res.sendFile(__dirname + "/Pages/" + "homepage.html");
});

//Get owner page and send it to whoever is requesting the page.
app.get('/owner',function(req,res){
    res.sendFile(__dirname + "/Pages/" + "BarOwnerPage.html");
});

//Get user page and send it to whoever is requesting the page.
app.get('/user',function(req,res){
    res.sendFile(__dirname + "/Pages/" + "userpage.html");
});

//Get login gateway and send it to whoever is requesting the page.
app.get('/LoginGateway',function(req,res){
    res.sendFile(__dirname + "/Pages/" + "LoginPage.html");
});

//Get sign up page and send it to whoever is requesting the page.
app.get('/SignUp',function(req,res){
    res.sendFile(__dirname + "/Pages/" + "SignUpPage.html");
});

//Get login system and send it to whoever is requesting the page.
app.get('/Login',function(req,res){
    res.sendFile(__dirname + "/Pages/" + "LoginSystem.html");
});


//Get listen for any requests on port 3000.
app.listen(3000, function(){
    console.log('EECS 448 project app listening on port 3000');
})