'use strict';

module.exports = class User {
  constructor (nickname, tag, userID) {
    this._nickname = nickname;
    this._tag = tag;
    this._userID = userID;
  }

  get nickname () {
    return this._nickname;
  }

  set nickname (newName) {
    this._nickname = newName;
  }

  get tag () {
    return this._tag;
  }

  set tag (newTag) {
    this._tag = newTag;
  }

  get userID () {
    return this._userID;
  }

  set userID (newUserID) {
    this._userID = newUserID;
  }
};