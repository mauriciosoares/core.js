# core [![Build Status](https://travis-ci.org/mauriciosoares/core.js.svg?branch=master)](https://travis-ci.org/mauriciosoares/core.js) [![Coverage Status](https://img.shields.io/coveralls/mauriciosoares/core.js.svg)](https://coveralls.io/r/mauriciosoares/core.js) [![Code Climate](https://codeclimate.com/github/mauriciosoares/core.js/badges/gpa.svg)](https://codeclimate.com/github/mauriciosoares/core.js)


core.js helps you create scalable applications written in JavaScript, giving you structure and patterns needed to keep everything separated, have loading, saving, replaying events and logging.

__core__ is a concept introduced by Nicholas C. Zakas in this [video](https://www.youtube.com/watch?v=b5pFv9NB9fs)


## The Idea

Conceptually, everything in your application is a module, and your modules should work independently from each other, so if one module breaks, the others should not.

The central piece is the core.

A module should never talks directly to another module, for that you use a combination of listeners and notifications.

## Getting Started

So let's think about the twitter page, and how we could re-build it using the __core__ concept

![Twitter Modules](https://cloud.githubusercontent.com/assets/2321259/5558085/3caa2e2c-8d00-11e4-8eba-4613b593193f.png)

Everything inside a red square is a module, they work independently.


## Installing


`npm i @eroc/core`


## Import

Raw import

`import { createCore, ALL, ERROR } from "./node_modules/@eroc/core/dist/core.es.js";`

With Node.js, rollup, webpack or parcel

`import { createCore, ALL, ERROR } from "@eroc/core";`

With old Node.js or Browserify

`const { createCore, ALL, ERROR } = require("@eroc/core/dist/core.umd.cjs");`

With Deno

`import { createCore } from "https://unpkg.com/@eroc/core/dist/core.es.js";`


### Building modules

A module exports start.

```js
export { start, stop };


const start = function (emitter) {
  return {};
};
```

A module may export a stop function.
  
  Optional:
  
   * stop
   * getState
   * restoreState 


```js
const stop = function (startReturn) {
  // this allows to close open files, sockets, etc
};

const restoreState = function (startReturn, state) {
  // do what is necessary to restore sate
};


const getState = function (startReturn) {
  // return the current state
  // for example in a drawing application , all the coordinates and shapes drawn
};
```

To start this module in your core file:

```js
import { createCore } from "@eroc/core";
import * as exampleModule from "./exampleModule.js";

const core = createCore();
core.start(exampleModule);
```

Modules can only communicate via messages with other modules with the emitter received when start is called. It guarantees that if a module tries to call something that doesn't exists or is broken, it won't break the module itself.

```js
emitter.on(EVENT_NAME, function (data) {

});

emitter.emit(EVENT_NAME, { a: 7 });
```

To avoid spelling mistakes, import event names from a common file called eventNames.js.


### Destroying modules

To stop a module use the method `core.stop()`.

```js
const exampleId = core.start(exampleModule);
core.stop(exampleId);
```

When you stop a module, the function `stop` will be called, if it exists.

### Communicating between modules

Now, thinking about Twitter, every time you tweet something, it should appear on your tweet list right? But since our modules don't talk directly to each other, let's use the emitter.

Our `tweet` module should notify other modules that something has happened.

#### tweet.js

```js
export { start };
import { NEW_TWEET } from "./eventNames.js";


const start = function(emitter) {
  // For the sake of simplicity, use an interval
  setInterval(function() {
    emitter.emit(NEW_TWEET,  {
      author: `Mauricio Soares`,
      text: `core is pretty #cool`
    });
  }, 5 * 1000)
};
```

Every 5 seconds, this module notifies everything that is listening to `NEW_TWEET` that something has happened. If nothing is listening to it, then nothing happens.

Our `tweet-list` is going to listen for this notifications.

#### tweet-list.js

```js
export { start };
import { NEW_TWEET } from "./eventNames.js";


const start = function (emitter) {
  emitter.on(NEW_TWEET, (data) => {
      // do something with the data
  });
};
```

Cool right? If one of those modules stop working, then it will not break the other one!



## API 

### createCore

#### `createCore()`

Returns a new instance of core.

#### `core.start(module, options)`

 * `module`  The module as a name-space ( `import * as exampleModule from "./exampleModule.js"` )
 * `options` optional object
   * name optional, String or Symbol that becomes *moduleInstanceId*
   * data optional, will be passed as second argument to the start function of the module
   * worker optional, if true the module will be inside a worker see 4.1.0 limitations

returns a promise that resolves with *moduleInstanceId* that can later be used to stop the module


```js
const exampleInstanceId = await core.start(exampleModule);
```


#### `core.stop(moduleInstanceId)`

```js
await core.stop(exampleInstanceId);
```

#### `ALL`

Constant to listen to all events

```js
// listen for all events
core.on(ALL, ({ name, data, time }) => {
    const timeString = new Date(time).toISOString();
    console.debug(`${timeString} event ${String(name)} with data`, data);
});
```

#### `ERROR`

Constant to listen to most errors

```js
// listen for errors
core.on(ERROR, ({ time, phase, error }) => {
    const timeString = new Date(time).toISOString();
    console.error(`Error during phase ${phase} at ${timeString}`, error);
});
```

### logging

Optional logging to get started

#### `useDefaultLogging(core, logger=console)`

```js
import { createCore, useDefaultLogging } from "@eroc/core";


const core = createCore();

// listen for all events
useDefaultLogging(core);
```

### eventRecorder

Utility to record all events. [example](./examples/replay/main.js)

#### `startEventRecorder(core)`

returns an eventRecording. Access `eventRecording.events` to view all past events.

#### `stopEventRecorder(core, eventRecording);`

stops an eventRecording.

```js
import { createCore, useDefaultLogging } from "@eroc/core";


const core = createCore();
let eventRecording = startEventRecorder(core);
stopEventRecorder(core, eventRecording);
```

### eventPlayer

Helper to replay events.

#### `replayEvents(core, previousEvents, { sameSpeed = false })`

Will replay previousEvents on core. previousEvents could come from `eventRecording.events` or from a database. Make sure to initialize modules before, for it to have any effect. While events are replayed regular event emits are disabled. This avoids duplicated events in case you emit events as a consequence of another event.


```js
import { createCore, replayEvents } from "@eroc/core";


const core = createCore();
// ... initialize modules
const events = // get events
replayEvents(core, events, { sameSpeed: true }); 
```

### `await core.restoreAllStates({})`

ReplayEvents might not be possible past a certain limit. That is why you may want to implement a state restoring mechanism.
Expects an object with keys being modules names and values being the state to restore. Modules need a `restoreState` function for this to have any effect.

### `await core.getAllStates()`

Returns all states. Resolved value is the same shape as what `core.restoreAllStates` expects. Has no effect for modules that do not define a `getState` function.


## Fast load with restoreAllState + eventPlayer

Ideally neither restoreAllState nor eventPlayer are used alone to load a given state. EventPlayer alone would require to store all events from the beginning and replaying them 1  by one which can take huge overhead in both memory and time. And restoreAll state would lose precision, because not every state is saved. So the ideal is to periodically save state and capture the events from there on. 

## Maintainers

- Mauricio Soares - https://github.com/mauriciosoares
- GrosSacASac 

## Contributing

1. [Fork](https://help.github.com/forking/) core
2. Create a topic branch - `git checkout -b my_branch`
3. Change some files and git commit
4. Push to your branch - `git push origin my_branch`
5. Send a [Pull Request](https://help.github.com/articles/using-pull-requests)


## Testing

You need [NodeJS](https://nodejs.org/) installed on your machine

1. `npm i`
2. `npm run bundle`
3. `npm t`

## Changelog

### 4.2.0

 * Modules inside worker can use restoreState and getState

### 4.1.0

 * Modules without imports and export, without restoreState and getState can run inside worker

### 4.0.0

 * Core class is replaced with createCore function
 * The default logger no longer displays the time (you can create your own logger)

### 3.3.0

 * replayEvents returns a promise

### 3.2.0

 * more compact logging
 * core.start accepts addition named data parameter that will be passed to the start function as second argument


### 3.1.0

 * Add optional getState and restoreState function as part as a module
 * Add getState to the core
 * Add getAllStates to the core
 * Add restoreState to the core
 * Add restoreAllStates to the core

### 3.0.0

 * Use abstract name to import for dependencies. Change default main. Convert to ES module.
 * Rename dist/core.umd.js into dist/core.umd.cjs
 
### 2.2.0

 * Add default logger

### 2.1.0

 * eventPlayer, eventRecorder extras are importable directly from the core

### 2.0.0

 * core.start, core.stop return Promises
 * the module start and stop can return a promise
 * errors are emitted

### 1.1.0 introduce event recorder and player
### 1.0.0 stable release
### 0.15.0 major architecture change
### 2018-10-30   v0.13.0  remove deprecated startAll and stopAll 
### 2018-10-29   v0.12.0  Drop bower and publish on npm
### 2018                  Various changes
### 2015-06-15   v0.7.3   Refactor UMD
### 2015-05-14   v0.7.2   Hotfix with ID's
### 2015-02-15   v0.7.0   Deprecate `Core.stopAll`
### 2015-02-12   v0.6.0   Deprecate `Core.startAll`
### 2015-02-05   v0.5.0   Changes `x` to `use` in `Sandbox`
### 2015-01-17   v0.4.0   Add UMD
### 2015-01-15   v0.3.0   Ability to return values from init and destroy methods
### 2015-01-10   v0.2.1   Improve error messages
### 2014-12-30   v0.2.0   Isolation of DOM in modules
### 2014-12-21   v0.1.0   Release usable version

## License

[MIT License](./LICENSE)
