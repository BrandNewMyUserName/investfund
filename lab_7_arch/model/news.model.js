const connection = require("../config/config.bd");

var News = function(newNews) {
    this.news_id = newNews.news_id;
    this.title = newNews.title;
    this.datetime_announced = newNews.datetime_announced;
    this.source = newNews.source;
}

News.create = function(newNews, result) {
    connection.query('INSERT INTO news SET ?', newNews, function(err, res) {
        if(err) {
            console.log("An error occurred while trying to create new news: ", err);
            result(err, null);
        } else {
            console.log(res.insertId);
            result(null, res.insertId);
        }
    });
};

News.findByID = function(id, result) {
    connection.query('SELECT * FROM news WHERE news_id = ?', id, function(err, res) {
        if(err) {
            console.log("Error occurred while trying to find news by ID: ", err);
            result(err, null);
        } else {
            result(null, res);
        }
    });
};

News.findAll = function(result) {
    connection.query('SELECT * FROM news', function(err, res) {
        if(err) {
            console.log("Error occurred while trying to find all news: ", err);
            result(err, null);
        } else {
            console.log("News: ", res);
            result(null, res);
        }
    });
};

News.update = function(id, updatedNews, result) {
    connection.query('UPDATE news SET title = ?, datetime_announced = ?, source = ? WHERE news_id = ?',
        [updatedNews.title, updatedNews.datetime_announced, updatedNews.source, id], 
        function(err, res) {
        if(err) {
            console.log("Error occurred while trying to update news: ", err);
            result(err, null);
        } else {
            result(null, res);
        }
    });
};

News.delete = function(id, result) {
    connection.query('DELETE FROM news WHERE news_id = ?', [id], function(err, res) {
        if(err) {
            console.log("Error occurred while trying to delete news: ", err);
            result(err, null);
        } else {
            result(null, res);
        }
    });
};

module.exports = News;