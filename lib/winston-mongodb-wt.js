var util = require('util'),
    winston = require('winston'),
    mongoose = require('mongoose'),
    logSchema = require('./schema');

var MongoDB = winston.transports.MongoDB = function (options) {
    winston.Transport.call(this, options);
    options = (options || {});

    if (!options.db) {
        throw new Error('You should provide db to log to.');
    }
    this.name = options.name || 'mongodb';
    this.level = options.level || 'info';
    this.db = options.db;
    this.options = options.options;
    if (!this.options) {
        this.options = {
            db    : {
                native_parser: true
            },
            server: {
                poolSize     : 2,
                socketOptions: {autoReconnect: true}
            }
        };
    }
    this.collection = (options.collection || 'log');
    this.errorCollection = (options.errorCollection || 'log');
    this.level = (options.level || 'info');
    this.silent = options.silent;
    this.username = options.username;
    this.password = options.password;
    this.storeHost = options.storeHost;
    this.label = options.label;
    this.capped = options.capped;
    this.cappedSize = (options.cappedSize || 10000000);

    var conn = mongoose.createConnection(this.db);
    this.logModel = conn.model(this.collection, logSchema);
    if (this.errorCollection != this.collection) {
        this.errorModel = conn.model(this.errorCollection, logSchema);
    } else {
        this.errorModel = this.logModel;
    }

};

util.inherits(MongoDB, winston.Transport);

MongoDB.prototype.log = function (level, msg, meta, callback) {
    var self = this;

    function onError(err) {
        self.emit('error', err);
        callback(err, null);
    }

    process.nextTick(function () {
        var entry = level == "error" ? new self.errorModel : new self.logModel();
        entry.message = msg;
        entry.timestamp = new Date().getTime();
        entry.level = level;
        entry.meta = meta;
        if (meta.opt_id) {
            entry.opt_id = meta.opt_id;
        }
        if (self.storeHost) {
            entry.hostname = self.hostname;
        }
        if (self.label) {
            entry.label = self.label;
        }
        entry.save(function (err) {
            if (err) {
                return onError(err);
            }
            callback(null, true);
        });

    })

};

exports.MongoDB = MongoDB;