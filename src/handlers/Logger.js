'use strict';

const pino = require('pino');
const { loggingLevel } = require('../resources/config.json');

// Instantiate logger
const logger = pino({
  prettyPrint: {
    levelFirst: true,
    translateTime: 'SYS:standard',
  },
  prettifier: require('pino-pretty'),
});

// Configure additional logger settings
logger.level = loggingLevel;
logger.info('Pino logger initialized.');

module.exports = logger;