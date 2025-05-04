const News = require('../model/news.model');

exports.findAll = function(req, res) {
    News.findAll(function(err, news) {
        if(err) {
            res.status(500).send({
                message: err.message || "Some error occurred while retrieving news."
            });
        } else {
            res.send(news);
        }
    });
};

exports.findByID = function(req, res) {
    News.findByID(req.params.news_id, function(err, news) { 
        if(err) {
            res.status(500).send({
                message: err.message || "Some error occurred while retrieving news."
            });
        } else {
            res.send(news);
        }
    });
}

exports.update = function(req, res) {
    // Validate request
    if(!req.body) {
        return res.status(400).send({
            error: true,
            message: "News content can not be empty"
        });
    }

    // Create a News
    const updatedNews = new News({
        title: req.body.title,
        datetime_announced: req.body.datetime_announced,
        source: req.body.source
    });

    // Save News in the database
    News.update(req.params.news_id, updatedNews, function(err, data) {
        if(err) {
            res.status(500).send({
                message: err.message || "Some error occurred while updating news."
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
            message: "News content can not be empty"
        });
    }

    // Create a News
    const newNews = new News({
        title: req.body.title,
        datetime_announced: req.body.datetime_announced,
        source: req.body.source
    });

    // Save News in the database
    News.create(newNews, function(err, data) {
        if(err) {
            res.status(500).send({
                message: err.message || "Some error occurred while creating news."
            });
        } else {
            res.send(data);
        }
    });
}

exports.delete = function(req, res) {
    News.delete(req.params.news_id, function(err, data) {
        if(err) {
            res.status(500).send({
                message: err.message || "Some error occurred while deleting news."
            });
        } else {
            res.send({error: false, message: `News ${req.params.news_id} was deleted successfully!`});
        }
    });
}