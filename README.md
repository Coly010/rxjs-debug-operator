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

## API

### Signature

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
