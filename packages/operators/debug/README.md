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

_P.S. This did originate as a meme idea :P_

## Usage

### Installation

Install the package:  
`npm install rxjs-debug-operator`

### Adding it to your code

It's super simple to add and use:

```ts
const obs$ = source.pipe(debug());
```

It even allows you to turn it off if you are in a production environment, or for any other reason you wouldn't want to log to the console:

```ts
const obs$ = source.pipe(debug({ shouldIgnore: true }));
```

## API

### Signature

`debug(config?: Partial<DebugOperatorConfig>)`

### DebugOperatorConfig

See the list of options available to configure the operator below

| Option         |            Description            | Type      | Default |
| -------------- | :-------------------------------: | --------- | ------- |
| `shouldIgnore` | Do not perform the logging action | `boolean` | `false` |
