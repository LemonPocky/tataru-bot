'use strict';

const { User, logger } = require('..');
const { UserDatabase } = require('../db');

/**
 * Catalog of users registered to Tataru. Handles fetching and storing users from
 * a local datastore.
 */

class Users {
  async initDB () {
    logger.info('Initializing users database.');
    if (!this.userDatabase) {
      this.userDatabase = new UserDatabase();
    }
  }

  async getUserByID (id) {
    const user = new User();
    user.id = id;
    const result = await this.userDatabase.findUser(user);
    return result.pop();
  }
}

module.exports = new Users();