var express     = require("express");
var app         = express();
var bodyParser  = require("body-parser");
var mysql       = require('mysql');
var bcrypt      = require('./js/bcrypt.js');
var helmet      = require('helmet');
var session     = require('express-session');

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
app.use(session({
  resave: false, // don't save session if unmodified
  saveUninitialized: false, // don't create session until something stored
  secret: 'shhhh, very secret'
}));

//Session-persisted message middleware
app.use(function(req, res, next){
    var err = req.session.error;
    var msg = req.session.success;
    delete req.session.error;
    delete req.session.success;
    res.locals.message = '';
    if (err) res.locals.message = '<p class="msg error">' + err + '</p>';
    if (msg) res.locals.message = '<p class="msg success">' + msg + '</p>';
    next();
});

//Get homepage and send it to whoever is requesting the page.
app.get('/', restrict, function(req,res){
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
app.get('/Login', function(req,res){
    res.sendFile(__dirname + "/Pages/" + "LoginSystem.html");
});

app.get('/logout', function(req, res){
  // destroy the user's session to log them out
  // will be re-created next request
  req.session.destroy(function(){
    res.redirect('/LoginGateway');
  });
});

//Verify user and log them in.
app.post('/auth', function(req, res){
    var username = req.body.username;
    var password = req.body.password;

    req.session.user = 2;
    
    connection.query("SELECT * FROM BarUsers WHERE username = ?", username, function (error, results, fields) {
        if (error){
            res.send('{"msg": "Error logging in.", "auth": "false"}');
        } 
        else {
            bcrypt.comparePassword(password, results[0].password, function(err, isPasswordMatch){
                if(err){
                    res.send('{"isValid": "false"}');    
                }
                else if(isPasswordMatch){
                    req.session.regenerate(function(){
                        // Store the user's primary key
                        // in the session store to be retrieved,
                        // or in this case the entire user object
                        req.session.user = results[0];
                        req.session.success = 'Authenticated as ' + results[0].username
                            + ' click to <a href="/logout">logout</a>. '
                            + ' You may now access <a href="/restricted">/restricted</a>.';
                        res.send('{"isValid": "true"}');
                    });
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
                    req.session.regenerate(function(){
                        // Store the user's primary key
                        // in the session store to be retrieved,
                        // or in this case the entire user object
                        req.session.user = user;
                        req.session.success = 'Authenticated as ' + user.username
                            + ' click to <a href="/logout">logout</a>. '
                            + ' You may now access <a href="/restricted">/restricted</a>.';
                        res.send('{"msg": "Successfully signed up", "isSignedUp": "true"}');
                    });
                }
            });
        }
    });
});

//Check if user logged in otherwise redirect them to the login page.
function restrict(req, res, next) {
  if (req.session.user) {
    console.log(req.session.user);
    next();
  } else {
    console.log("User not found");
    next();
  }
}

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