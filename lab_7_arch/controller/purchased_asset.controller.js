const PurchasedAsset = require('../model/purchased_asset.model');

exports.findAll = function(req, res) {
    PurchasedAsset.findAll(function(err, purchasedAssets) {
        if(err) {
            res.status(500).send({
                message: err.message || "Some error occurred while retrieving purchased assets."
            });
        } else {
            res.send(purchasedAssets);
        }
    });
};

exports.findByID = function(req, res) {
    const ids = {
        portfolio_id: req.params.portfolio_id,
        instrument_id: req.params.instrument_id
    };
    PurchasedAsset.findByID(ids, function(err, purchasedAsset) { 
        if(err) {
            res.status(500).send({
                message: err.message || "Some error occurred while retrieving purchased asset."
            });
        } else {
            res.send(purchasedAsset);
        }
    });
}

exports.update = function(req, res) {
    // Validate request
    if(!req.body) {
        return res.status(400).send({
            error: true,
            message: "Purchased asset content can not be empty"
        });
    }

    // Create a PurchasedAsset
    const updatedPurchasedAsset = new PurchasedAsset({
        average_price: req.body.average_price,
        amount: req.body.amount,
        last_updated: req.body.last_updated
    });

    const ids = {
        portfolio_id: req.params.portfolio_id,
        instrument_id: req.params.instrument_id
    };

    // Save PurchasedAsset in the database
    PurchasedAsset.update(ids, updatedPurchasedAsset, function(err, data) {
        if(err) {
            res.status(500).send({
                message: err.message || "Some error occurred while updating purchased asset."
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
            message: "Purchased asset content can not be empty"
        });
    }

    // Create a PurchasedAsset
    const newPurchasedAsset = new PurchasedAsset({
        portfolio_id: req.body.portfolio_id,
        instrument_id: req.body.instrument_id,
        average_price: req.body.average_price,
        amount: req.body.amount,
        last_updated: req.body.last_updated
    });

    // Save PurchasedAsset in the database
    PurchasedAsset.create(newPurchasedAsset, function(err, data) {
        if(err) {
            res.status(500).send({
                message: err.message || "Some error occurred while creating purchased asset."
            });
        } else {
            res.send(data);
        }
    });
}

exports.delete = function(req, res) {
    const ids = {
        portfolio_id: req.params.portfolio_id,
        instrument_id: req.params.instrument_id
    };
    PurchasedAsset.delete(ids, function(err, data) {
        if(err) {
            res.status(500).send({
                message: err.message || "Some error occurred while deleting purchased asset."
            });
        } else {
            res.send({error: false, message: `Purchased asset with portfolio_id ${req.params.portfolio_id} and instrument_id ${req.params.instrument_id} was deleted successfully!`});
        }
    });
}