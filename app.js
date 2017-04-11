var express     = require("express");
var app         = express();
var bodyParser  = require("body-parser");
var mysql       = require('mysql');
var bcrypt      = require('./js/bcrypt.js');
var helmet      = require('helmet');

//Set up the connection to the database
var connection = mysql.createConnection({
  host     : 'mysql.eecs.ku.edu',
  user     : 'rcheruiy',
  password : 'drow1',
  database : 'rcheruiy'
});

//Connect to the database
connection.connect();

//Create allow public access to images, js, css, and font files.
//Also support JSON/URL-Encoded bodies
app.use('/images', express.static(__dirname + '/images'));
app.use('/js', express.static(__dirname + '/js'));
app.use('/css', express.static(__dirname + '/css'));
app.use('/fonts', express.static(__dirname + '/fonts'));
app.use(bodyParser.json());                                 //Support JSON-Encoded bodies
app.use(bodyParser.urlencoded({extended: true}));           //Support URL-Encoded Bodies
app.use(helmet());                                          //Protext app from well known vulerabilities (https://expressjs.com/en/advanced/best-practice-security.html)

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

//Verify user and log them in.
app.post('/auth', function(req, res){
    var username = req.body.username;
    var password = req.body.password;
    
    connection.query("SELECT password FROM BarUsers WHERE username = ?", username, function (error, results, fields) {
        if (error){
            res.send('{"msg": "Error logging in.", "auth": "false"}');
        } 
        else {
            bcrypt.comparePassword(password, results[0].password, function(err, isPasswordMatch){
                if(err){
                    res.send('{"isValid": "false"}');    
                }
                else if(isPasswordMatch){
                    res.send('{"isValid": "true"}');
                }
                else{
                    res.send('{"isValid": "false"}');
                }
            });
        }
    });
});

//Sign up the user and store them into the database.
app.post('/signup', function(req, res){
    var fields = req.body;

    bcrypt.cryptPassword(fields.password, function(err, hash){
        if (err){
            res.send('{"msg": "Error signing up. Please contact j714a273@ku.edu for assistance.');
        }
        else{
            var user = {username: fields.username, firstname: fields.firstname, lastname: fields.lastname, age: fields.age, email: fields.email, password: hash, isOwner: fields.isOwner };

            connection.query("INSERT INTO BarUsers SET ?", user, function (error, results, fields) {
                if (error){
                    if(error.code == "ER_DUP_ENTRY")
                        res.send('{"msg": "User already exists.", "isSignedUp": "false"}');
                    else
                        res.send('{"msg": "Error connecting to database.", "isSignedUp": "false"}');
                } 
                else {
                    res.send('{"msg": "Successfully signed up", "isSignedUp": "true"}');
                }
            });
        }
    });
});


process.stdin.resume();//so the program will not close instantly

function exitHandler(options, err) {
    connection.close();
    if (options.cleanup) console.log('clean');
    if (err) console.log(err.stack);
    if (options.exit) process.exit();
}

//do something when app is closing
process.on('exit', exitHandler.bind(null,{cleanup:true}));

//catches ctrl+c event
process.on('SIGINT', exitHandler.bind(null, {exit:true}));

//catches uncaught exceptions
process.on('uncaughtException', exitHandler.bind(null, {exit:true}));

//Get listen for any requests on port 3000.
app.listen(process.env.PORT || 3000);