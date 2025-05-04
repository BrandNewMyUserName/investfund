const connection = require("../config/config.bd");

var Instrument = function(newInstrument) {
    this.instrument_id = newInstrument.instrument_id;
    this.name = newInstrument.name;
    this.symbol = newInstrument.symbol;
    this.type = newInstrument.type;
}

Instrument.create = function(newInstrument, result) {
    connection.query('INSERT INTO instrument set ?', newInstrument, function(err, res){
        if(err){
            console.log("An error occurred while trying to create new instrument: ", err);
            result(err, null);
        }
        else{
            console.log(res.insertId);
            result(null, res.insertId);
        }
    });
};

Instrument.findByID = function(id, result) {
    connection.query('SELECT * FROM instrument WHERE instrument_id = ?', id, function(err, res){
        if(err){
            console.log("Error occurred while trying to find instrument by ID: ", err);
            result(err, null);
        }
        else{
            result(null, res);
        }
    });
};

Instrument.findAll = function(result) {
    connection.query('SELECT * FROM instrument', function(err, res){
        if(err){
            console.log("Error occurred while trying to find all instrument: ", err);
            result(err, null);
        }
        else{
            console.log("Instruments: ", res);
            result(null, res);
        }
    });
};

Instrument.update = function(id, updatedInstrument, result) {
    connection.query('UPDATE instrument SET name = ?, symbol = ?, type = ? WHERE instrument_id = ?',
        [updatedInstrument.name, updatedInstrument.symbol, updatedInstrument.type, id], 
        function(err, res){
        if(err){
            console.log("Error occurred while trying to update instrument: ", err);
            result(err, null);
        }
        else{
            result(null, res);
        }
    });
};

Instrument.delete = function(id, result) {
    connection.query('DELETE FROM instrument WHERE instrument_id = ?', [id],
        function(err, res){
        if(err){
            console.log("Error occurred while trying to delete instrument: ", err);
            result(err, null);
        }
        else{
            result(null, res);
        }
    });
};

module.exports = Instrument;
