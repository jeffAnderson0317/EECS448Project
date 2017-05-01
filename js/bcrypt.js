//Written and Debugged by: Jeff Anderson
//Tested by: All project members

var bcrypt = require('bcrypt');

//Encrypt the password using bcrypt node js library.
module.exports.cryptPassword = function(password, callback) {
   bcrypt.genSalt(10, function(err, salt) {
    if (err) 
      return callback(err);

    bcrypt.hash(password, salt, function(err, hash) {
      return callback(err, hash);
    });

  });
};

//Compare the passwords using bcrypt node js library.
module.exports.comparePassword = function(password, userPassword, callback) {
   bcrypt.compare(password, userPassword, function(err, isPasswordMatch) {
      if (err) 
        return callback(err);
      return callback(null, isPasswordMatch);
   });
};