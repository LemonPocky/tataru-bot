'use strict';

const { logger } = require('../');
const Database = require('./database.js');

/**
 * Database representing users registered to Tataru Bot. Persists even if bot DC's.
 * Schema:
 * { 
 *   userID: 0 // Discord ID of the user
 *   characters: [] // Array of characters belonging to the user
 * }
 *
 */
module.exports = class CharacterDatabase extends Database {
  constructor () {
    super('users.db');
  }

  async findCharacter (character) {
    const params = {};
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