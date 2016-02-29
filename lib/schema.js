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

var DurationSchema = new Schema({
    name     : {type: String, index: true},
    duration : {type: Number, index: true},
    createdAt: {type: Number}
});
exports = module.exports = {
    log     : LogSchema,
    duration: DurationSchema
};