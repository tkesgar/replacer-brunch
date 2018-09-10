## replacer-brunch

[![Build Status](https://travis-ci.org/tkesgar/replacer-brunch.svg?branch=master)](https://travis-ci.org/tkesgar/replacer-brunch)

Ruthlessly simple string replacement plugin to [Brunch](http://brunch.io).

## Configuration

```js
replacer: {
  // dict is an array containing objects with key and value property.
  // String replacements are processed in order from first to last.
  dict: [
    {
      // key will be replaced by value.
      key: '__KEY__',
      value: '__VALUE__'
    },
    {
      // You can use anything as value.
      // Non-string values will be passed through JSON.stringify().
      key: '__PACKAGE__',
      value: require('./package.json')
    },
    {
      // By default replacer uses String.replace(), so only the first
      // occurrence will be replaced if you use a string as key.
      // You can use a global regex to replace all occurrences.
      key: /__ENV__/g,
      value: process.env.NODE_ENV
    },
    {
      // Use cases: getting NODE_ENV, package.json values,
      // custom configuration JSON, generate random string, etc.
      key: /{#VERSION}/g,
      value: 'v1.0.0'
    },
    {
      key: 'remove_me'
      // If value is omitted, the replacement is the empty string
    }
  ],
  // By default replacer uses String.replace() function.
  // If you want to use a different function, you can supply
  // your own replacement function here with this signature:
  //  - str (string) - string to be processed
  //  - key (any) - key from the dict
  //  - value (string) - replacement value
  //  - path (string) - the path of the file being processed
  replace: (str, key, value, path) => str.split(key).join(value)
}
```

For example, to replace `__filename` with the name of the file being
processed, you can use:

```js
replacer: {
  dict: [
    {
      key: /\b__filename\b/,
      // No value needed - the custom replacer below supplies it
    }
  ],
  replace: (str, key, value, path) => {
    return str.split(key).join(`'${path}'`);
  }
}
```

## Installation

Install the plugin via npm with `npm install --save-dev replacer-brunch`.

Or, do manual install:

* Add `"replacer-brunch": "~x.y.z"` to `package.json` of your brunch app.
* If you want to use git version of plugin, use the GitHub URI
`"replacer-brunch": "tkesgar/replacer-brunch"`.

## License

Licensed under [MIT License](https://github.com/tkesgar/replacer-brunch/blob/master/LICENSE).

## Contributors

* [Ted Kesgar](https://github.com/tkesgar)
* [Chris White](https://github.com/cxw42)
