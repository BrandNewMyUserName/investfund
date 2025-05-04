const connection = require("../config/config.bd");

var PurchasedAsset = function(newPurchasedAsset) {
    this.portfolio_id = newPurchasedAsset.portfolio_id;
    this.instrument_id = newPurchasedAsset.instrument_id;
    this.average_price = newPurchasedAsset.average_price;
    this.amount = newPurchasedAsset.amount;
    this.last_updated = newPurchasedAsset.last_updated;
}

PurchasedAsset.create = function(newPurchasedAsset, result) {
    connection.query('INSERT INTO purchased_asset SET ?', newPurchasedAsset, function(err, res) {
        if(err) {
            console.log("An error occurred while trying to create new purchased asset: ", err);
            result(err, null);
        } else {
            console.log("Created purchased asset");
            result(null, res);
        }
    });
};

PurchasedAsset.findByID = function(ids, result) {
    connection.query('SELECT * FROM purchased_asset WHERE portfolio_id = ? AND instrument_id = ?', 
        [ids.portfolio_id, ids.instrument_id], 
        function(err, res) {
        if(err) {
            console.log("Error occurred while trying to find purchased asset by ID: ", err);
            result(err, null);
        } else {
            result(null, res);
        }
    });
};

PurchasedAsset.findAll = function(result) {
    connection.query('SELECT * FROM purchased_asset', function(err, res) {
        if(err) {
            console.log("Error occurred while trying to find all purchased assets: ", err);
            result(err, null);
        } else {
            console.log("Purchased assets: ", res);
            result(null, res);
        }
    });
};

PurchasedAsset.update = function(ids, updatedPurchasedAsset, result) {
    connection.query('UPDATE purchased_asset SET average_price = ?, amount = ?, last_updated = ? WHERE portfolio_id = ? AND instrument_id = ?',
        [updatedPurchasedAsset.average_price, updatedPurchasedAsset.amount, updatedPurchasedAsset.last_updated, ids.portfolio_id, ids.instrument_id], 
        function(err, res) {
        if(err) {
            console.log("Error occurred while trying to update purchased asset: ", err);
            result(err, null);
        } else {
            result(null, res);
        }
    });
};

PurchasedAsset.delete = function(ids, result) {
    connection.query('DELETE FROM purchased_asset WHERE portfolio_id = ? AND instrument_id = ?', 
        [ids.portfolio_id, ids.instrument_id], 
        function(err, res) {
        if(err) {
            console.log("Error occurred while trying to delete purchased asset: ", err);
            result(err, null);
        } else {
            result(null, res);
        }
    });
};

module.exports = PurchasedAsset;