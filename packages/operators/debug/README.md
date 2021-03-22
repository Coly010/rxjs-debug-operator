<h1 align="center">RxJS Debug Operator 🐛</h1>

---

<p align="center">
  <a href="https://www.npmjs.com/package/rxjs-debug-operator"><img src="https://img.shields.io/badge/npm-rxjs--debug--operator-blueviolet.svg" /></a>
  <a href="https://www.npmjs.com/package/rxjs-debug-operator"><img src="https://img.shields.io/npm/v/rxjs-debug-operator.svg" /></a>
  <a href="https://www.npmjs.com/package/rxjs-debug-operator"><img src="https://img.shields.io/npm/dt/rxjs-debug-operator.svg" /></a>
  <a href="https://www.npmjs.com/package/rxjs-debug-operator"><img src="https://img.shields.io/npm/l/rxjs-debug-operator.svg" /></a>
</p>

---

We've all had occasions where we've felt the need to simply pipe a `tap(console.log)` to our Observables to get some insight into what is occuring at a certain time.

This operator aims to reduce the amount of typing you'll have to do!

## Usage

### Installation

Install the package:  
`npm install rxjs-debug-operator`

### Adding it to your code

It's super simple to add and use:

Use your prefered import method:

```js
import { debug } from 'rxjs-debug-operator';
// OR
const { debug } = require('rxjs-debug-operator');
```

Then pipe it to your Observables:

```ts
const obs$ = source.pipe(debug());
```

You can add a label to help identify the Observable:

```ts
const obs$ = source.pipe(debug('My Observable'));
// OUTPUT
// My Observable    {value}
```

It even allows you to turn it off if you are in a production environment, or for any other reason you wouldn't want to log to the console:

```ts
const obs$ = source.pipe(debug({ shouldIgnore: true }));
```

### Examples

We can use it on its own to simply log out values to the console

```ts
const obs$ = of('my test value');
obs$.pipe(debug()).subscribe();

// OUTPUT:
// my test value
```

We can add a label to the logs:

```ts
const obs$ = of('my test value');
obs$.pipe(debug('Obserable A')).subscribe();

// OUTPUT:
// Obserable A    my test value

// We can label it using the config object syntax:
const obs$ = of('my test value');
obs$.pipe(debug({ label: 'Obserable A' })).subscribe();

// OUTPUT:
// Obserable A    my test value

// However, if we add a label and custom notification handlers,
// we will not get the label in the logs by default:
const obs$ = of('my test value');
obs$
  .pipe(
    debug({
      label: 'Obserable A',
      next: (value) => console.log(value),
    })
  )
  .subscribe();

// OUTPUT:
// my test value
```

We can also set up our own notification handlers if we prefer:

```ts
const obs$ = of('my test value');
obs$
  .pipe(debug({ next: (value) => console.log('my custom handler:', value) }))
  .subscribe();

// OUTPUT:
// my custom handler:   my test value

const obs$ = throwError('uh oh');
obs$
  .pipe(debug({ error: (value) => console.log('my error handler:', value) }))
  .subscribe();

// OUTPUT:
// my error handler:   uh oh

const obs$ = of('my test value');
obs$
  .pipe(debug({ complete: (value) => console.log('I completed') }))
  .subscribe();

// OUTPUT:
// I completed
```

We can access the default logger for more flexibility:

```js
const obs$ = of('my test value');

obs$
  .pipe(
    debug((logger) => ({
      next: (v) => logger.warn('Warning!', v),
    }))
  )
  .subscribe();

// OUTPUT
// WARN: Warning!   my test value
```

## Setting Global Config

You can set some globals that make it more convenient to change:

- the default logger
- a global prefix to be appended to all logs
- a global-level ignore flag

### Change the Default Logger

You can change the default logger by creating an object that matches the `DebugLogger` interface, which can be seen below:

```ts
export interface DebugLogger {
  log: (...args: unknown[]) => void;
  error: (...args: unknown[]) => void;
  warn?: (...args: unknown[]) => void;
  debug?: (...args: unknown[]) => void;
  info?: (...args: unknown[]) => void;
}
```

Once you have created your new logger, you can set it to be used as the default logger using `setGlobalDebugConfig()`

```js
setGlobalDebugConfig({
  logger: myNewLogger,
});
```

Now all your `debug()` operators will use your new logger to log the values it receives.

### Adding a Global Prefix

You can also add a string prefix to all your logs at a global level, which can be useful to help identify logs.

```js
setGlobalDebugConfig({
  prefix: 'My Prefix',
});
```

### Setting whether to ignore logging

You can also set whether all `debug()` should not log at the global level. This can be useful for turning it off in production environments.

```js
setGlobalDebugConfig({
  shouldIgnore: isProduction,
});
```

### Example Winston Usage

```ts
import { DebugLogger, setGlobalDebugConfig } from 'rxjs-debug-operator';
const winston = require('winston');

const sysLogger = winston.createLogger({
  level: 'info',
  format: winston.format.json(),
  transports: [
    //
    // - Write all logs with level `error` and below to `error.log`
    // - Write all logs with level `info` and below to `combined.log`
    //
    new winston.transports.File({ filename: 'error.log', level: 'error' }),
    new winston.transports.File({ filename: 'combined.log' }),
  ],
});

const debugLogger: DebugLogger = {
  log: (v) => sysLogger.info(v),
  error: (e) => sysLogger.error(e),
};

setGlobalDebugConfig({ logger: debugLogger });

const obs$ = of('my test value');
obs$.pipe(debug()).subscribe();

// OUTPUT
// 'my test value' written to `combined.log`
```

### **NOTES**

**It should be noted that local config options passed to the `debug()` operator will take precedence over any global values**

## API

### Debug

`debug(config?: Partial<DebugOperatorConfig>)`

### DebugOperatorConfig

See the list of options available to configure the operator below

| Option         |                            Description                             | Type                       | Default         |
| -------------- | :----------------------------------------------------------------: | -------------------------- | --------------- |
| `shouldIgnore` |                  Do not perform the Debug actions                  | `boolean`                  | `false`         |
| `label`        |      Add a label to the logs to help identify the Observable       | `string`                   | `null`          |
| `next`         |    Action to perform when Observer receives a Next notification    | `(value: T) => void`       | `console.log`   |
| `error`        |   Action to perform when Observer receives an Error notification   | `(value: unknown) => void` | `console.error` |
| `complete`     | Action to perform when Observer receives a Completion notification | `() => void`               | `() => null`    |

### Global Debug Config

`setGlobalDebugConfig(config: Partial<GlobalDebugConfig>)`

### GlobalDebugConfig

| Option         |                       Description                       | Type          | Default   |
| -------------- | :-----------------------------------------------------: | ------------- | --------- |
| `shouldIgnore` |            Do not perform the Debug actions             | `boolean`     | `false`   |
| `prefix`       | Add a label to the logs to help identify the Observable | `string`      | `null`    |
| `logger`       |    Logger to use to log values recieved by `debug()`    | `DebugLogger` | `console` |

### DebugLogger

| Option   | Description | Type                           | Default         |
| -------- | :---------: | ------------------------------ | --------------- |
| `log`    |  Basic log  | `(...args: unknown[]) => void` | `console.log`   |
| `error`  |  Error log  | `(...args: unknown[]) => void` | `console.error` |
| `info?`  |  Info log   | `(...args: unknown[]) => void` | `console.info`  |
| `warn?`  |  Warn log   | `(...args: unknown[]) => void` | `console.warn`  |
| `debug?` |  Debug log  | `(...args: unknown[]) => void` | `console.debug` |
