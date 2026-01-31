const { createLogger, transports, format } = require("winston");

class Logger {
  constructor() {
    if (!Logger.instance) {
      Logger.instance = createLogger({
        level: "info",
        format: format.combine(
          format.timestamp(),
          format.json()
        ),
        transports: [
          new transports.Console()
        ]
      });
    }
    return Logger.instance;
  }
}

module.exports = new Logger();
