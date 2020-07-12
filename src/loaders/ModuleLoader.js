'use strict';

const { logger } = require('../');
const { Encounters, Characters } = require('../modules/');

module.exports = class ModuleLoader {
  async load () {
    if (!Encounters.dbExists()) {
      // load encounters from FF Logs
      await Encounters.initDB();
    }
    if (!Characters.dbExists()) {
      await Characters.initDB();
    }
    logger.info('Modules successfully loaded.');
  }
};