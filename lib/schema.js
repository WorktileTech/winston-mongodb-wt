var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

var LogSchema = new Schema({
    label    : {type: String, index: true},
    message  : {type: String},
    timestamp: {type: Number, index: true},
    level    : {type: String},
    opt_id   : {type: String, default: "", index: true},
    meta     : {type: Object}
}, {_id: false});
exports = module.exports = LogSchema;