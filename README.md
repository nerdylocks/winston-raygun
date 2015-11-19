### raygun-winston

A Raygun transport for winston.

### Usage

```javascript
var winston = require('winston');
var Raygun  = require('winston-raygun');

winston.add(Raygun, {
  apiKey: '<YOUR_RAYGUN_KEY>',

  // OPTIONAL. Defaults to 'error':
  enableLevels: ['info', 'error'],
  // OPTIONAL. Defaults to `true`. When `false`, it fakes the error stack trace, to stop Raygun aggregating errors together:
  enableAggregation: true
});

```

### License

MIT
