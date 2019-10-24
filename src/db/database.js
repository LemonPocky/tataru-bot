'use strict';

const nedb = require('nedb');
const util = require('util');
const { logger } = require('../');
// TODO: Figure out how to clean hardcoded pathnames
const dbDir = `${process.cwd()}/db`;

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
      this.database = new nedb({ filename: `${dbDir}/${this.databaseFilename}`,
        autoload: true, onload: ((error) => {
        if (error) {
          logger.error(`Failed to open DB with filename ${dbFilename}.`);
          throw error;
        }
      }) });
      logger.trace(`Opened DB with filename ${dbFilename}.`);
    }
  }

  /**
   * Queries the database and returns the results.
   * @param params object representing the parameters of the query
   */
  async find (params) {
    const newFind = util.promisify(this.database.find);

    // Need to use call() because promisify() loses "this" context
    return await newFind.call(this.database, params);
  }

  /**
   * Inserts a document into the database.
   * @param document the document to insert. To insert a batch of documents, pass in
   *        an array of documents.
   */
  async insert (document) {
    const newInsert = util.promisify(this.database.insert);
    return await newInsert.call(this.database, document);
  }

  /**
   * Removes all documents from a database.
   */
  async removeAll () {
    const newRemove = util.promisify(this.database.remove);
    return await newRemove.call(this.database, {}, { multi: true });
  }

  /**
   * Manually compact the database persistence file.
   */
  async compact () {
    // Create a promise that only resolves when compaction is complete (safer this way I guess)
    return new Promise((resolve, reject) => {
      this.database.persistence.compactDataFile();
      this.database.on('compaction.done', error => {
        if (error) {
          logger.error(`Error performing compaction of ${this.databaseFilename}.`
            + ' Some data may have been lost!');
          reject();
        }
        logger.trace(`Compaction of ${this.databaseFilename} completed.`);
        resolve();
      });
    });
  }
};