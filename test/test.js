var winston = require('winston');

/**
 * Requiring `winston-mongodb` will expose
 * `winston.transports.MongoDB`
 */
var MongoDB = require('../lib/winston-mongodb-wt').MongoDB;

winston.add(MongoDB, {
    label          : 'wtweb',
    db             : "mongodb://localhost:27017/wtlog",
    errorCollection: "error",
    redis          : {
        host    : "42.121.64.136",
        port    : "9322",
        password: 'Worktile16@5'
    }
});

winston.info("哈哈 我是info", {op: 123});
winston.info("哈哈 我是info1", "dddd", {op: 123});

winston.error(new Error("的确报错了"), "哈哈 error", {op: 123});

winston.error("哈哈 error1", {op: 123});

winston.error("哈哈 error2", "eeee", {op: 123});