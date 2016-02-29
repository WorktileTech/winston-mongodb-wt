var util = require('util'),
    winston = require('winston'),
    mongoose = require('mongoose'),
    schemas = require('./schema'),
    redis = require('redis'),
    os = require("os");

var MongoDB = winston.transports.MongoDB = function (options) {
    winston.Transport.call(this, options);
    options = (options || {});
    self = this;
    if (!options.db) {
        throw new Error('You should provide db to log to.');
    }
    this.name = options.name || 'mongodb';
    this.level = options.level || 'info';
    this.db = options.db;
    this.redis = options.redis;
    if (this.redis && (!this.redis.host || !this.redis.port)) {
        throw new Error('You should provide correct redis config.');
    }
    this.dbOptions = options.dbOptions;
    if (!this.dbOptions) {
        this.dbOptions = {
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

    var conn = mongoose.createConnection(this.db, this.dbOptions);
    this.connection = conn;
    this.logModel = conn.model(this.collection, schemas.log);
    if (this.errorCollection != this.collection) {
        this.errorModel = conn.model(this.errorCollection, schemas.log);
    } else {
        this.errorModel = this.logModel;
    }
    this.durationModel = conn.model("duration", schemas.duration);
    if (this.redis) {
        this.redisClient = redis.createClient(this.redis.port, this.redis.host, this.redis.options)
        if (this.redis.password) {
            this.redisClient.auth(this.redis.password);
        }
        this.redisClient.on('error', function (err) {
            console.error(err);
            self.emit('error', err);
        });
    }

    function exitHandler(options, err) {
        conn.close(function () {
            if (err) {
                console.log(err.stack)
            }
            console.log("mongodb for log closed when process " + options.name);
        });
    }

    process.on('SIGINT', exitHandler.bind(null, {name: "SIGINT"}));
    process.on('exit', exitHandler.bind(null, {name: "exit"}));
    process.on('uncaughtException', exitHandler.bind(null, {name: "uncaughtException"}));
};

util.inherits(MongoDB, winston.Transport);

MongoDB.prototype.log = function (level, msg, meta, callback) {
    var self = this;

    function onError(err) {
        self.emit('error', err);
        console.error(err);
        callback(err, null);
    }

    process.nextTick(function () {
        var entity = level == "error" ? new self.errorModel : new self.logModel();
        entity.message = msg;
        entity.timestamp = new Date().getTime();
        entity.level = level;
        entity.meta = meta;
        if (meta && meta.oid) {
            entity.oid = meta.oid;
        }
        if (self.storeHost) {
            entity.hostname = self.hostname;
        }
        if (self.label) {
            entity.label = self.label;
        }
        if (level == 'error' && self.redisClient) {
            var sendEntity = {
                message  : entity.message,
                meta     : entity.meta,
                timestamp: entity.timestamp,
                hostname : os.hostname(),
                label    : entity.label
            };
            self.redisClient.publish(self.redis.channel || "logError", JSON.stringify(sendEntity));
        }

        entity.save(function (err) {
            if (err) {
                return onError(err);
            }
            callback(null, true);
        });

    })

};

MongoDB.prototype.addDuration = function (name, duration, callback) {
    var self = this;
    process.nextTick(function () {
        var model = new self.durationModel({
            name     : name,
            duration : duration,
            createdAt: new Date().getTime()
        });
        model.save(function (err) {
            if (err) {
                self.emit('error', err);
                return callback && callback(err);
            }
            callback && callback(null, true);
        })
    })
};

MongoDB.prototype.query = function (page, size) {
    return this.logModel.find({})
        .sort({'timestamp': 'desc'})
        .skip((page - 1) * size)
        .limit(size);
};
exports.MongoDB = MongoDB;