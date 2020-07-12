'use strict';

const readdir = require('recursive-readdir');
const Discord = require('discord.js');
const logger = require('./logger.js');

// Prefix is the character(s) that indicate this message is a bot command (e.g. "t!ping")
// TODO: make prefix configurable [maybe not necessary]
const { prefix } = require('../resources/config.json');
// TODO: Figure out how to clean hardcoded pathnames
const commandsDir = `${process.cwd()}/commands`;

module.exports = class CommandHandler {
  constructor (client) {
    this.client = client;
    this.commands = new Discord.Collection();
    this.cooldowns = new Discord.Collection();
    try {
      this.loadCommands();
      this.client.commands = this.commands;
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

    // store the commands using the name as keys and the command obj as values
    for (const file of commandFiles) {
      const newCommand = require(file);
      const command = new newCommand(this.client);
      this.commands.set(command.name, command);
      this.cooldowns.set(command.name, new Discord.Collection());
      logger.debug(`Loaded command: ${command.name}`);
    }
  }

  runCommand (message) {
    // Our client needs to know if it will execute a command
    // It will listen for messages that will start with the prefix (t!)
    if (message.content.substring(0, prefix.length) === prefix) {
    const args = message.content.slice(prefix.length).split(/ +/);
    const commandName = args.shift().toLowerCase();
    const command = this.commands.get(commandName);

    // If not a valid command, ignore message
    if (!command) {
      logger.trace(`Ignored command: ${commandName}`);
      return;
    }
    logger.debug(`Detected command: ${commandName} ${args.length ? `| With args: ${args}` : ''} `
      + `Author: ${message.author.tag}(${message.guild.name})`);

    // Check if command is off cooldown for the author
    const timestamps = this.cooldowns.get(commandName);
    const cooldownAmount = (command.cooldown || 3) * 1000;
    const now = Date.now();
    if (timestamps.has(message.author.id)) {
      const expirationTime = timestamps.get(message.author.id) + cooldownAmount;

      if (now < expirationTime) {
        const timeLeft = (expirationTime - now) / 1000;
        message.channel.send(`Please wait **${timeLeft.toFixed(1)}** more second(s) before reusing **${command.name}**.`)
          .catch((error) => {
            logger.error(`Error sending cooldown warning to ${message.guild}.`);
            logger.error(error);
          });
        return;
      }
    }
    // Set new timeout timestamp
    timestamps.set(message.author.id, now);
    setTimeout(() => timestamps.delete(message.author.id), cooldownAmount);

    try {
      command.execute(message, args);
    } catch (error) {
      logger.error(`Error running command ${message}`);
      logger.error(error);
    }
   }
  }
};