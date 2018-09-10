'use strict';

class BrunchReplacer {
  constructor(config) {
    this.config = config.plugins.replacer || {};

    // Set defaults for config.
    if (!this.config.dict) this.config.dict = [];
    if (!this.config.replace) {
      this.config.replace = (str, key, value) => str.replace(key, value);
    }

    // Stringify non-string values.
    for (const entry of this.config.dict) {
      const value = entry.value;
      if (typeof value === 'undefined') {
        entry.value = '';
      } else {
        entry.value = typeof value === 'string' ? value : JSON.stringify(value);
      }
    }
  }

  compile(file) {
    const dict = this.config.dict;
    const replace = this.config.replace;

    // Ignore falsy and files without data.
    if (!file || !file.data) return Promise.resolve(file);

    // Perform replacement.
    for (const entry of dict) {
      const key = entry.key;
      const value = entry.value;
      file.data = replace(file.data, key, value, file.path);
    }

    return Promise.resolve(file);
  }
}

BrunchReplacer.prototype.brunchPlugin = true;
BrunchReplacer.prototype.type = 'javascript';
BrunchReplacer.prototype.pattern = /\.jsx?$/;
BrunchReplacer.prototype.defaultEnv = '*';

module.exports = BrunchReplacer;
