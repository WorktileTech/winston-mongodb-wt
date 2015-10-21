var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

var LogSchema = new Schema({
    label    : {type: String, index: true},
    message  : {type: String},
    timestamp: {type: Number, index: true},
    level    : {type: String},
    oid      : {type: String, default: "", index: true},
    meta     : {type: Object}
});
exports = module.exports = LogSchema;