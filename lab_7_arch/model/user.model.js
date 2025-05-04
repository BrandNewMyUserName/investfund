const connection = require("../config/config.bd");

var User = function(newUser) {
    this.user_id = newUser.user_id;
    this.name = newUser.name;
    this.email = newUser.email ;
    this.password = newUser.password;
    this.datetime_created = newUser.datetime_created;
}


User.create = function(newUser, result) {
    connection.query('INSERT INTO user set ?', newUser, function(err, res){
        if(err){
            if(err.code === 'ER_DUP_ENTRY'){
                console.log("An error occurred while trying to create new user: ", "Email already exists");
                result({ type: "DUPLICATE_EMAIL", message: "Email already exists." }, null);
            }
            else {
                console.log("An error occurred while trying to create new user: ", err);
                result(err, null);
            }
        }
        else{
            console.log(res.insertId);
            result(null, res.insertId);
        }
    });
};

User.findByID = function(id, result) {
    connection.query('SELECT * FROM user WHERE user_id = ?', id, function(err, res){
        if(err){
            console.log("Error occurred while trying to find user by ID: ", err);
            result(err, null);
        }
        else{
            result(null, res);
        }
    });
};

User.findAll = function(result) {
    connection.query('SELECT * FROM user', function(err, res){
        if(err){
            console.log("Error occurred while trying to find all user: ", err);
            result(err, null);
        }
        else{
            console.log("Users: ", res);
            result(null, res);
        }
    });
};

User.update = function(id, updatedUser, result) {
    connection.query('UPDATE user SET name = ?, email = ?, password = ?, datetime_created = ? WHERE user_id = ?',
        [updatedUser.name, updatedUser.email, updatedUser.password, updatedUser.datetime_created,  id], 
        function(err, res){
        if(err){
            console.log("Error occurred while trying to update user: ", err);
            result(err, null);
        }
        else{
            result(null, res);
        }
    });
};

User.delete = function(id, result) {
    connection.query('DELETE FROM user WHERE user_id = ?', [id],
        function(err, res){
        if(err){
            console.log("Error occurred while trying to delete user: ", err);
            result(err, null);
        }
        else{
            result(null, res);
        }
    });
};

User.login = function(email, password, result) {
    connection.query('SELECT * FROM user WHERE email = ? AND password = ?', [email, password],
        function(err, res){
        if(err){
            console.log("Error during login: ", err);
            result(err, null);
        }
        else{
            result(null, res);
        }
    });
}

module.exports = User;