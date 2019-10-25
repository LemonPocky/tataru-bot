'use strict';

const { logger } = require('../');
const { Encounters, Characters } = require('../modules/');

module.exports = class ModuleLoader {
  async load () {
    try {
      if (!Encounters.dbExists()) {
        // load encounters from FF Logs
        await Encounters.initDB();
      }
      if (!Characters.dbExists()) {
        await Characters.initDB();
      }
      logger.info('Modules successfully loaded.');
    } catch (error) {
        logger.error('Error initializing bot.');
        logger.error(error);
    }
  }
};