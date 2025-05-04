const connection = require("../config/config.bd");

var Portfolio = function(newPortfolio) {
    this.portfolio_id = newPortfolio.portfolio_id;
    this.balance = newPortfolio.balance;
    this.user_id = newPortfolio.user_id ;
}


Portfolio.create = function(newPortfolio, result) {
    connection.query('INSERT INTO portfolio set ?', newPortfolio, function(err, res){
        if(err){
            console.log("An error occurred while trying to create new portfolio: ", err);
            result(err, null);
        }
        else{
            console.log(res.insertId);
            result(null, res.insertId);
        }
    });
};

Portfolio.findByID = function(id, result) {
    connection.query('SELECT * FROM portfolio WHERE portfolio_id = ?', id, function(err, res){
        if(err){
            console.log("Error occurred while trying to find portfolio by ID: ", err);
            result(err, null);
        }
        else{
            result(null, res);
        }
    });
};

Portfolio.findAll = function(result) {
    connection.query('SELECT * FROM portfolio', function(err, res){
        if(err){
            console.log("Error occurred while trying to find all portfolio: ", err);
            result(err, null);
        }
        else{
            console.log("Users: ", res);
            result(null, res);
        }
    });
};

Portfolio.update = function(id, updatedPortfolio, result) {
    connection.query('UPDATE portfolio SET balance = ?, user_id = ? WHERE portfolio_id = ?',
        [updatedPortfolio.balance, updatedPortfolio.user_id, id], 
        function(err, res){
        if(err){
            console.log("Error occurred while trying to update portfolio: ", err);
            result(err, null);
        }
        else{
            result(null, res);
        }
    });
};

Portfolio.delete = function(id, result) {
    connection.query('DELETE FROM portfolio WHERE portfolio_id = ?', [id],
        function(err, res){
        if(err){
            console.log("Error occurred while trying to delete portfolio: ", err);
            result(err, null);
        }
        else{
            result(null, res);
        }
    });
};

module.exports = Portfolio;
