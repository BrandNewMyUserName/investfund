const Instrument = require('../model/instrument.model');

exports.findAll = function(req, res) {
    Instrument.findAll(function(err, instrument) {
        if(err) {
            res.status(500).send({
                message: err.message || "Some error occurred while retrieving instruments."
            });
        } else {
            res.send(instrument);
        }
    });
};

exports.findByID = function(req, res) {
    Instrument.findByID(req.params.instrument_id, function(err, instrument) { //Перевірити id
        if(err) {
            res.status(500).send({
                message: err.message || "Some error occurred while retrieving instrument."
            });
        } else {
            res.send(instrument);
        }
    });
}

exports.update = function(req, res) {
    // Validate request
    if(!req.body) {
        return res.status(400).send({
            error: true,
            message: "Instrument content can not be empty"
        });
    }

    // Create a Instrument
    const updatedInstrument = new Instrument({
        name: req.body.name,
        symbol: req.body.symbol,
        type: req.body.type
    });

    // Save Instrument in the database
    Instrument.update(req.params.instrument_id, updatedInstrument, function(err, data) {
        if(err) {
            res.status(500).send({
                message: err.message || "Some error occurred while updating instrument."
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
            message: "Instrument content can not be empty"
        });
    }

    // Create a Instrument
    const newInstrument = new Instrument({
        name: req.body.name,
        symbol: req.body.symbol,
        type: req.body.type
    });

    // Save Instrument in the database
    Instrument.create(newInstrument, function(err, data) {
        if(err) {
            res.status(500).send({
                message: err.message || "Some error occurred while creating instrument."
            });
        } else {
            res.send(data);
        }
    });
}

exports.delete = function(req, res) {
    Instrument.delete(req.params.instrument_id, function(err, data) {
        if(err) {
            res.status(500).send({
                message: err.message || "Some error occurred while deleting instrument."
            });
        } else {
            res.send({error: false, message: `Instrument ${req.params.instrument_id} was deleted successfully!`});
        }
    });
}

