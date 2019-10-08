'use strict';

const nedb = require('nedb');
const { logger } = require('../');

/**
 * Base database class that handles queries to NeDB.
 */
module.exports = class Database {

//  let database;
//  let databaseFilename;

  /**
   * @param dbFilename Filename that the persistent database data is stored in.
   *       If it does not exist, it will be created.
   *       If not specified, then an in-memory only db will be created.
   */
  constructor (dbFilename) {
    if (typeof dbFilename === 'undefined') {
      this.database = new nedb();
      logger.trace('Created DB with no filename, in-memory only.');
    } else {
      this.databaseFilename = dbFilename;
      this.database = new nedb({ filename: this.databaseFilename, autoload: true, onload: ((error) => {
        logger.error(`Failed to open DB with filename ${dbFilename}.`);
        logger.error(error.message);
      }) });
      logger.trace(`Opened DB with filename ${dbFilename}.`);
    }
  }
};