'use strict';

const { logger } = require('../../');
const { Encounters, Characters } = require('../../modules/');

module.exports = {
  name: 'start',
  description: '[Administrator only] Run this command first so I can start working!'
    + ' I will gather all the initial information I need'
    + ' from FF Logs plus get things set up so I can start helping you.',

  /**
   * Initializes bot setup, including fetching encounter information from FF Logs, etc.
   */
  async execute (message) {
    // This command is privileged.
    if (!message.member.hasPermission('ADMINISTRATOR')) {
      message.channel.send('Only Administrators can execute this command.');
      return;
    }

    if (!Encounters.dbExists()) {
      try {
        // load encounters from FF Logs
        await Encounters.initDB();
        await Characters.initDB();
        message.channel.send('Hello, I\'m Tataru! I\'m ready to be of service. If you need help getting'
          + ' started, use "t!help".');
      } catch (error) {
        logger.error('Error initializing bot.');
        logger.error(error);
        message.channel.send('Uwaa! Something\'s gone terribly wrong... But please let me try again!');
      }
    } else {
      message.channel.send('I\'m already ready! If you need help getting'
          + ' started, use "t!help".');
    }
  },
};