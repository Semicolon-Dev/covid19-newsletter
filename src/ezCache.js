const crypto = require('crypto');
const fs = require('fs');

module.exports.Cache = class Cache {
  currentHash;

  constructor() {
    this.currentHash = fs.readFileSync('src/previousHash.txt', 'utf8');
  }

  isHit(data) {
    if (!data) {
      throw new Error('No data provided')
    };

    const hash = this._newHashFromData(data);
    const result = this.currentHash === hash;

    if (!result) {
      this._update(hash);
    }

    return result;
  }

  _newHashFromData(data) {
    return crypto.createHash('sha1')
      .update(JSON.stringify(data))
      .digest('hex');
  }

  _update(hash) {
    this.currentHash = hash;

    fs.writeFileSync('src/previousHash.txt', this.currentHash, 'utf8');
    return this.currentHash;
  }
}