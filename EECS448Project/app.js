var express = require("express");
var app = express();

app.get('/', function(req,res){
    res.sendFile('Pages/homepage.html');
});

app.listen(3000, function(){
    console.log('EECS 448 project app listening on port 3000');
})