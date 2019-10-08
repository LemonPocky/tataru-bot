'use strict';

const axios = require('axios');
const { logger } = require('../');

const key = process.env.FFLOGS_PUBLIC_KEY;
const apiVersion = 'v1';

module.exports = class FFlogs {
  constructor () {
    this.instance = axios.create({
      baseURL: `https://www.fflogs.com/${apiVersion}`,
    });
  }

  async getZones () {
    return new Promise((resolve, reject) => {
      axios.get('/zones', {
        params: {
          api_key: key,
        },
      }).then(result => {
        resolve(result);
      }, error => {
        logger.error('Failed to retrieve zone information from FF Logs.');
        reject(error);
      });
    });
  }
};