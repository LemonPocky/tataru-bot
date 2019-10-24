'use strict';

module.exports = class Character {
  constructor (name, server, userID = 0) {
    this._name = name;
    this._server = server;
    this._userID = userID;
  }

  get name () {
    return this._name;
  }

  set name (newName) {
    this._name = newName;
  }

  get server () {
    return this._server;
  }

  set server (newServer) {
    this._server = newServer;
  }

  get userID () {
    return this._userID;
  }

  set userID (newUserID) {
    this._userID = newUserID;
  }
};