const Portfolio = require('../model/portfolio.model');

exports.findAll = function(req, res) {
    Portfolio.findAll(function(err, Portfolio) {
        if(err) {
            res.status(500).send({
                message: err.message || "Some error occurred while retrieving portfolios."
            });
        } else {
            res.send(Portfolio);
        }
    });
};

exports.findByID = function(req, res) {
    Portfolio.findByID(req.params.portfolio_id, function(err, user) { 
        if(err) {
            res.status(500).send({
                message: err.message || "Some error occurred while retrieving portfolio."
            });
        } else {
            res.send(user);
        }
    });
}

exports.update = function(req, res) {
    // Validate request
    if(!req.body) {
        return res.status(400).send({
            error: true,
            message: "Portfolio content can not be empty"
        });
    }

    // Create a Portfolio
    const updatedPortfolio = new Portfolio({
        balance: req.body.balance,
        user_id: req.body.user_id,
    });

    // Save Portfolio in the database
    Portfolio.update(req.params.portfolio_id, updatedPortfolio, function(err, data) {
        if(err) {
            res.status(500).send({
                message: err.message || "Some error occurred while updating portfolio."
            });
        } else {
            res.send(data);
        }
    });
}

exports.create = function(req, res) {
    // Validate request
    if(!req.body) {
        return res.status(400).send({
            error: true,
            message: "User content can not be empty"
        });
    }

    // Create a Portfolio
    const newPortfolio = new Portfolio({
        name: req.body.name,
        symbol: req.body.symbol,
        type: req.body.type
    });

    // Save Portfolio in the database
    Portfolio.create(newPortfolio, function(err, data) {
        if(err) {
            res.status(500).send({
                message: err.message || "Some error occurred while creating user."
            });
        } else {
            res.send(data);
        }
    });
}

exports.delete = function(req, res) {
    Portfolio.delete(req.params.portfolio_id, function(err, data) {
        if(err) {
            res.status(500).send({
                message: err.message || "Some error occurred while deleting user."
            });
        } else {
            res.send({error: false, message: `User ${req.params.portfolio_id} was deleted successfully!`});
        }
    });
}

