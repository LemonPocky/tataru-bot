'use strict';

const { Command } = require('../../');

module.exports = class Ping extends Command {
  constructor (client) {
    super(client, {
      name: 'ping',
      description: 'Ping!',
    });
  }

  async execute (message, args) {
    message.channel.send('Pong.');
  }
};