'use strict';

const { logger } = require('..');
const fflogs = require('../apis/fflogs');
const { CharacterDatabase } = require('../db');

/**
 * Catalog of characters registered to Tataru. Handles fetching of characters from
 * FF Logs, checking their validity, and storing them in a local datastore.
 */

class Characters {
  async initDB () {
    logger.info('Initializing characters database.');
    if (!this.characterDatabase) {
      this.characterDatabase = new CharacterDatabase();
    }
  }

  /**
   * Sends a request to FF Logs for a character. Returns true on a valid response code
   * (even if the response body is empty).
   * @param character Character to check for
   * @returns true if character exists in FF Logs, otherwise false
   */
  async charExistsInFFLogs (character) {
    try {
      const response = await fflogs.getRankings(character);

      if (response) {
        return true;
      }
      return false;
    } catch (error) {
      if (error.response) {
        if (error.response.status === 400) {
          return false;
        }
      }
      throw error;
    }
  }

  /**
   * Retrieves the character from the local database.
   * @character Character to retrieve (can be a partially defined Character object)
   * @return Character from the database, undefined if not found.
   */
  async getChar (character) {
    const result = await this.characterDatabase.findCharacter(character);
    return result.pop();
  }

  /**
   * Claims a character for the user by adding the character with the user's ID to
   * the local database.
   * @character Character to insert
   */
  async claim (character) {
    try {
      await this.characterDatabase.insertCharacter(character);
    } catch (error) {
      logger.error(`Could not insert ${character} into characterDatabase.`);
    }
  }
}

module.exports = new Characters();