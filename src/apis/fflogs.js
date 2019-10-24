'use strict';

const axios = require('axios');
const { logger, ServerRegionMap } = require('..');

const publicKey = process.env.FFLOGS_PUBLIC_TOKEN;
const privateKey = process.env.FFLOGS_PRIVATE_TOKEN;
const apiVersion = 'v1';

/**
 * Class which handles API calls to FF Logs.
 * https://www.fflogs.com/v1/docs/
 */
class FFlogs {
  constructor () {
    this.instance = axios.create({
      baseURL: `https://www.fflogs.com/${apiVersion}`,
    });
  }

  /**
   * Fetches zone information from FF Logs. Zones represent a category of fights
   * (e.g. Trials (Extreme) or Omega: Alphascape). Zones are divided into encounters
   * which are the individual fights in that zone (e.g. Suzaku). This API call
   * will retrieve all zone information from FF Logs, which is useful for mapping
   * encounters with their internal id.
   */
  async getZones () {
    return this.instance.get('/zones', {
      params: {
        api_key: publicKey,
      },
    });
  }

  /**
   * Fetches rankings from FF Logs for a certain character. Rankings show the top parse
   * for a character for a certain zone or encounter. If a character has no record for
   * a fight, the response will be empty.
   * @param character (Character type expected) The character to fetch rankings for
   * @param parameters Options to refine the rankings (see FF Logs API documentation).
   */
  async getRankings (character, parameters) {
    const region = ServerRegionMap[character.server];
    if (!region) {
      throw Error('Invalid server.');
    }
    if (!parameters) {
      parameters = {};
    }

    parameters.api_key = publicKey;
    return this.instance.get(`rankings/character/${character.name}/${character.server}/${region}`, {
      params: parameters,
    });
  }
}

// module returns a singleton instance of fflogs api object
module.exports = new FFlogs();