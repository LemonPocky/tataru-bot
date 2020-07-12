'use strict';

const { logger, Character, StringUtils, ServerRegionMap, Command } = require('../../');
const { Characters } = require('../../modules/');

module.exports = class Claim extends Command {
  constructor (client) {
    super (client, {
    name: 'claim',
    description: 'Use this command to register a character on FF Logs under your name. You can claim multiple '
      + 'characters but each character can only be claimed by one person. Please do not claim a character who does not belong '
      + 'to you! That would be very rude!',
    cooldown: 5,
    usage: 't!claim [character name] [character world]\n'
      + 'Ex: t!claim G\'raha Tia Zodiark',
    });
  }

  /**
   * Compiles character info from args and assigns the character to this user.
   * The character must exist in the FF Logs database and must not have been claimed before.
   */
  async execute (message, args) {
    if (!args || args.length !== 3) {
      message.channel.send(`**Usage:** ${this.usage}`);
      return;
    }

    const charName = StringUtils.capitalizeFirstLetter(args[0])
      + ' ' + StringUtils.capitalizeFirstLetter(args[1]);

    const charServer = StringUtils.capitalizeFirstLetter(args[2]);
    const charObj = new Character(charName, charServer);
    logger.debug(`${message.author.tag}(${message.guild.name}) wants to claim ${charName} in ${charServer}.`);
    try {
      // Check if specified server is valid
      if (!ServerRegionMap[charServer]) {
        logger.debug('Invalid server.');
        message.channel.send(`I'm sorry, ${charServer} is not a valid World.`);
        return;
      }

      // Check if character exists online
      const charExists = await Characters.charExistsInFFLogs(charObj);
      if (!charExists) {
        logger.debug('Character/server not found in FF Logs.');
        message.channel.send(`I'm sorry, I couldn't find a ${charName} in ${charServer}! Did you give me`
          + ' the correct spelling and world? And do they have at least one parse in FF Logs?');
        return;
      }

      // Check if character has already been claimed
      const charIsClaimed = await Characters.getChar(charObj);
      if (charIsClaimed) {
        this.client.fetchUser(charIsClaimed.userID)
          .then(owner => {
            logger.debug(`Character already claimed by user ${owner.tag}.`);
            message.channel.send(`${charName} in ${charServer} has already been claimed by ${owner.tag}.`);
          })
          .catch(error => {
            logger.error(error);
            message.channel.send(`${charName} in ${charServer} has already been claimed.`);
          });
        return;
      }

      // All checks passed, claim character
      charObj.userID = message.author.id;
      await Characters.claim(charObj);
      logger.info(`${charName}[${charServer}] claimed by ${message.author.tag}.`);
      message.channel.send(`<@${message.author.id}> has claimed ${charName} in ${charServer}!`);
    } catch (error) {
      logger.error('Error claiming character.');
      logger.error(error);
      message.channel.send('Sorry, I couldn\'t complete your request. Please try again later!')
        .catch(logger.error);
    }
  }
};