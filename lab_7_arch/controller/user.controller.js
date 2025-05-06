const User = require('../model/user.model');

exports.findAll = function(req, res) {
    User.findAll(function(err, users) {
        if(err) {
            res.status(500).send({
                message: err.message || "Some error occurred while retrieving users."
            });
        } else {
            res.send(users);
        }
    });
};

exports.findByID = function(req, res) {
    User.findByID(req.params.user_id, function(err, user) { 
        if(err) {
            res.status(500).send({
                message: err.message || "Some error occurred while retrieving user."
            });
        } else {
            res.send(user);
        }
    });
};

exports.update = function(req, res) {
    if(!req.body) {
        return res.status(400).send({
            error: true,
            message: "User content can not be empty"
        });
    }

    const updatedUser = new User({
        name: req.body.name,
        email: req.body.email,
        password: req.body.password,
        datetime_created: req.body.datetime_created
    });

    User.update(req.params.user_id, updatedUser, function(err, data) {
        if(err) {
            res.status(500).send({
                message: err.message || "Some error occurred while updating user."
            });
        } else {
            res.send({
                message: "User updated successfully!",
                user_id: data
            });
        }
    });
};

exports.create = function(req, res) {
    if(!req.body) {
        return res.status(400).send({
            error: true,
            message: "User content can not be empty"
        });
    }

    const newUser = new User({
        name: req.body.name,
        email: req.body.email,
        password: req.body.password,
        datetime_created: req.body.datetime_created
    });

    User.create(newUser, function(err, data) {
        if(err) {
            if (err.type == "DUPLICATE_EMAIL"){
                res.status(409).send({
                    error: true,
                    message: err.message
                });
            } else {
                res.status(500).send({
                    message: err.message || "Some error occurred while creating user."
                });
            }
        } else {
            res.send(data);
        }
    });
};

exports.register = function(req, res) {
    if(!req.body) {
        return res.status(400).send({
            error: true,
            message: "User content can not be empty"
        });
    }

    const newUser = new User({
        name: req.body.name,
        email: req.body.email,
        password: req.body.password,
        datetime_created: new Date()
    });

    User.create(newUser, function(err, data) {
        if(err) {
            if (err.type == "DUPLICATE_EMAIL"){
                res.status(409).send({
                    error: true,
                    message: err.message
                });
            } else {
                res.status(500).send({
                    message: err.message || "Some error occurred while creating user."
                });
            }
        } 
        else {
            req.session.authenticated = true;
            req.session.user = {
                user_id: data,
                name: req.body.name,
                email: req.body.email
            };
            console.log('Register session:', req.session); // Debug
            req.session.save((err) => {
                if (err) {
                    console.error('Session save error:', err);
                    res.status(500).send({ message: 'Failed to save session' });
                } else {
                    res.send({
                        message: "User registered successfully!",
                        user_id: data
                    });
                }
            });
        }
    });
};

exports.login = function(req, res) {
    if (!req.body.email || !req.body.password) {
        return res.status(400).send({
            error: true,
            message: "Email and password are required"
        });
    }

    User.login(req.body.email, req.body.password, function(err, user) {
        if (err) {
            res.status(500).send({
                message: err.message || "Some error occurred during login."
            });
        } else if (!user.length) {
            res.status(401).send({
                error: true,
                message: "Invalid email or password"
            });
        } else {
            req.session.authenticated = true;
            req.session.user = {
                user_id: user[0].user_id,
                name: user[0].name,
                email: user[0].email
            };
            console.log('Login session:', req.session); // Debug
            req.session.save((err) => {
                if (err) {
                    console.error('Session save error:', err);
                    res.status(500).send({ message: 'Failed to save session' });
                } else {
                    res.json({
                        message: "Login successful!",
                        user: req.session.user
                    });
                }
            });
        }
    });
};

exports.logout = function(req, res) {
    req.session.destroy((err) => {
        if (err) {
            res.status(500).send({
                message: "Error logging out"
            });
        } else {
            res.json({
                message: "Logout successful!"
            });
        }
    });
};

exports.getCurrentUser = function(req, res) {
    console.log('getCurrentUser session:', req.session); // Debug
    if (req.session.user) {
        res.json({ message: "LOL",
            user: req.session.user
        });
    } else {
        res.status(401).send({
            message: "Not authenticated"
        });
    }
};

exports.delete = function(req, res) {
    User.delete(req.params.user_id, function(err, data) {
        if(err) {
            res.status(500).send({
                message: err.message || "Some error occurred while deleting user."
            });
        } else {
            res.send({error: false, message: `User ${req.params.user_id} was deleted successfully!`});
        }
    });
};