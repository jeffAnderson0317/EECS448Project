var express = require("express");
var app = express();
var bodyParser = require("body-parser");

app.use('/images', express.static(__dirname + '/images'));
app.use('/js', express.static(__dirname + '/js'));
app.use('/css', express.static(__dirname + '/css'));
app.use(bodyParser.json());                         //Support JSON-Encoded bodies
app.use(bodyParser.urlencoded({extended: true}));   //Support URL-Encoded Bodies

//Get homepage and send it to whoever is requesting the page.
app.get('/', function(req,res){
    res.sendFile(__dirname + "/Pages/" + "LocalBarMap.html");
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

app.post('/login', function(req, res){
    var username = req.body.user.name;
});

app.post('/signup', function(req, res){
    var username = req.body.username;
});

//Get listen for any requests on port 3000.
app.listen(3000, function(){
    console.log('EECS 448 project app listening on port 3000');
})