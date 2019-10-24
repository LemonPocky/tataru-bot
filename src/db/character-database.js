'use strict';

const { logger } = require('../');
const Database = require('./database.js');

/**
 * Database representing characters registered to Tataru Bot. Persists even if bot DC's.
 * Schema:
 * { _id: 0,
 *   name: 'string',
 *   server: 'string',
 *   userID: 0 // ID of the user this character is registered to
 * }
 *
 */
module.exports = class CharacterDatabase extends Database {
  constructor () {
    super('characters.db');
  }

  async findCharacter (character) {
    let params = {};
    if (character.name) {
      params.name = character.name;
    }
    if (character.server) {
      params.server = character.server;
    }
    if (character.userID) {
      params.userID = character.userID;
    }

    return this.find(params);
  }

  async insertCharacter (character) {
    if (!character.name || !character.server || !character.userID) {
      throw new Error('Missing info. One or more fields is not defined.');
    }

    const doc = {
      name: character.name,
      server: character.server,
      userID: character.userID,
    };
    return this.insert(doc);
  }
};