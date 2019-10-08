'use strict';

const { logger, FFlogs } = require('../');
const ZoneDatabase = require('../nedb/zone-database.js');

/**
 * Handles gathering information about the zones (dungeons, trials, raids, etc)
 * from FFlogs and storing them in a local database.
 */
module.exports = class Zones {
  async initZonesDB () {
    logger.debug('Initializing zones database.');
    if (!this.zoneDatabase) {
      this.zoneDatabase = new ZoneDatabase();
    }

    try {
      const response = await this.fetchZones();
      await zoneDatabase.updateZones(response);
    } catch (error) {

    }
    const response = this.fetchZones();
    zoneDatabase.updateZones(response);
  }

  async fetchZones () {
    await FFlogs.getZones()
      .then(result => {
        return result.data;
      })
      .catch(error => {
        throw error;
      });
  }
};