var app = require(process.cwd() + '/app');
var winston = require('winston');
const dotenv = require('dotenv');
dotenv.config();

const options = {
    transports: [
        new winston.transports.Console({
            level: process.env.NODE_ENV === "production" ? "error" : "debug"
        }),
        new winston.transports.File({ filename: "debug.log", level: "debug" })
    ]
};
const logger = winston.createLogger(options);

if (process.env.NODE_ENV !== "production") {
    logger.add(new winston.transports.Console({
        format: winston.format.simple()
    }));
}

module.exports = logger;