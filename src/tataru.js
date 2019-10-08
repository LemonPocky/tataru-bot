'use strict';

const Discord = require('discord.js');
// Used for handling environment variables for api keys
const dotenv = require('dotenv');
// Listens for and executes commands (separate into handler and listener?)
const { logger, CommandHandler } = require('./handlers');

// Load environment variables
const dotenvError = dotenv.config().error;
if (dotenvError) {
  throw dotenvError;
}

// Authentication token can be obtained on discordapp.com/developers
const token = process.env.DISCORD_TOKEN;

// Initialize Discord client
const client = new Discord.Client();
const commandHandler = new CommandHandler();

// Log in to Discord using the authentication token
client.login(token)
    .catch(error => {
      logger.fatal(`Error logging in: ${error.message}`);
      return;
    });

// run once when bot is logged in to Discord
client.once('ready', () => {
  logger.info('Connected');
  logger.info(`Logged in as: ${client.user.username} - id:${client.user.id}`);

});

// When the bot detects a message in a text channel, check if it's a command via commandHandler
client.on('message', (message) => {
  if (message.author.bot) return;
  commandHandler.runCommand(message);
});