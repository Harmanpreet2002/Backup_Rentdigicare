const { createLogger, format, transports } = require('winston');
const { combine, timestamp, label, printf } = format;

exports.getProductionLogger = () => {
    const myFormat = printf(({ level, message, timestamp }) => {
        return `${timestamp} ${level}: ${message}`;
    });

    return createLogger({
        level: 'error',
        // format: winston.format.simple(),
        format: combine(
            format.colorize(),
            label({ label: 'Production Errors' }),
            timestamp({format: "HH:mm:ss"}),
            myFormat
        ),

        //defaultMeta: { service: 'user-service' },
        transports: [
            // new transports.Console(),
            new transports.File({
                filename: 'errors.log',
            })
        ],
    });

}






