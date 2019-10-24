'use strict';

const { logger } = require('..');
const fflogs = require('../apis/fflogs.js');
const { EncounterDatabase } = require('../db');
/**
 * Handles gathering information about the encounters (dungeons, trials, raids, etc)
 * from FFlogs and storing them in a local database.
 */
class Encounters {
  async initDB () {
    logger.info('Initializing encounters database.');
    if (!this.encounterDatabase) {
      this.encounterDatabase = new EncounterDatabase();
    }

    try {
      const response = await fetchEncounters();
      logger.debug('Retrieved encounter information from FF Logs.');
      await this.encounterDatabase.updateEncounters(response);
    } catch (error) {
      logger.error('Error initializing zones.');
      throw error;
    }
  }

  dbExists () {
    return this.encounterDatabase ? true : false;
  }
}

async function fetchEncounters () {
  try {
   const result = await fflogs.getZones();
   return result.data;
  } catch (error) {
    logger.error('Error retrieving zone data from FF Logs.');
    throw error;
  }
}

module.exports = new Encounters();
