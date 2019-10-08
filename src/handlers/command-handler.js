'use strict';

const readdir = require('recursive-readdir');
const Discord = require('discord.js');
const { logger } = require('../');

// Prefix is the character(s) that indicate this message is a bot command (e.g. "t!ping")
// TODO: make prefix configurable
const { prefix } = require('../resources/config.json');
// TODO: Figure out how to clean hardcoded pathnames
const commandsDir = `${process.cwd()}/commands`;

module.exports = class CommandHandler {
  constructor () {
    this.commands = new Discord.Collection();
    try {
      this.loadCommands();
      logger.debug('Loaded commandHandler');
    } catch (error) {
      logger.error('Failed to initialize command handler.');
      throw error;
    }
  }

  async loadCommands () {
    let commandFiles;

    // asynchronously get the .js files from "commands/" representing all the
    // available commands in our program
    await readdir(commandsDir).then(
      result => {
        commandFiles = result.filter(file => file.endsWith('.js'));
      },
      error => {
        logger.error(`Failed to load commands from '${commandsDir}'`);
        logger.error(error.message);
        throw error;
      });

    // store the commands using the filenames as keys and their "name:" property as values
    for (const file of commandFiles) {
      const command = require(file);
      this.commands.set(command.name, command);
      logger.debug(`Loaded command: ${command.name}`);
    }
  }

  runCommand (message) {
    // Our client needs to know if it will execute a command
    // It will listen for messages that will start with the prefix (t!)
    if (message.content.substring(0, prefix.length) === prefix) {
    const args = message.content.slice(prefix.length).split(/ +/);
    const command = args.shift().toLowerCase();
    logger.debug(`Detected command: ${command} ${args.length ? `| With args: ${args}` : ''}`);

    // If not a valid command, ignore message
    if (!this.commands.has(command)) {
      logger.trace(`Ignored command: ${command}`);
      return;
    }

    try {
      this.commands.get(command).execute(message, args);
    } catch (error) {
      logger.error(error);
      message.reply('there was an error trying to execute that command!');
    }
   }
  }
};