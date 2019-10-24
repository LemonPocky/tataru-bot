'use strict';

const { logger } = require('../');
const Database = require('./database.js');

/**
 * Database representing encounters reported by FF Logs.
 * Schema:
 * { _id: 0,
 *   name: 'string',
 *   zoneID: 0,
 *   zoneName: 'string' }
 */
module.exports = class EncounterDatabase extends Database {
  constructor () {
    super('encounters.db');
  }

  /**
   * Updates the encounter database. dataString is expected to contain information about
   * ALL encounters in FF Logs, so the database is completely wiped before update.
   * @param data data from a call to FF Logs '/zones' as a JS object
   */
  async updateEncounters (data) {
    const documents = [];

    for (const zone of data) {
      for (const encounter of zone.encounters) {
        const encounterID = encounter.id;
        const encounterName = encounter.name;
        const zoneID = zone.id;
        const zoneName = zone.name;

        const document = {
          _id: encounterID,
          name: encounterName,
          zoneID: zoneID,
          zoneName: zoneName,
        };
        logger.trace(`Found encounter ${document}`);
        documents.push(document);
      }
    }

    try {
      await this.removeAll();
      logger.debug('Cleared encounter database.');
      await this.insert(documents);
      logger.debug('Successfully inserted documents into encounter database.');
    } catch (error) {
      logger.error('Error updating database with encounter data.');
      throw error;
    }
  }
};