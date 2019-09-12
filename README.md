# core [![Build Status](https://travis-ci.org/mauriciosoares/core.js.svg?branch=master)](https://travis-ci.org/mauriciosoares/core.js) [![Coverage Status](https://img.shields.io/coveralls/mauriciosoares/core.js.svg)](https://coveralls.io/r/mauriciosoares/core.js) [![Code Climate](https://codeclimate.com/github/mauriciosoares/core.js/badges/gpa.svg)](https://codeclimate.com/github/mauriciosoares/core.js)

__core__ is a concept introduced by Nicholas C. Zakas in this [video](https://www.youtube.com/watch?v=b5pFv9NB9fs)

It helps you create scalable applications written in Javascript, giving you some structure and patterns to keep everything separated.



## The Idea

Conceptually, everything in your application is a module, and your modules should work independently from each other, so if one module breaks, the others should not.

A module should never talks directly to another module, for that you use a combination of listeners and notifications.

## Getting Started

So let's think about the twitter page, and how we could re-build it using the __core__ concept

![Twitter Modules](https://cloud.githubusercontent.com/assets/2321259/5558085/3caa2e2c-8d00-11e4-8eba-4613b593193f.png)

Everything inside a red square is a module, they work in a way that they don't depend on any other modules, and they should be programmed that way as well.


## Installing


`npm i @eroc/core`


## Import

Raw import

`import { Core } from "./node_modules/@eroc/core/dist/core.js";`

With rollup, webpack or parcel

`import { Core } from "@eroc/core";`

NodeJs or Browserify

`const { Core } = require("@eroc/core");`

Let's start with the tweet module.

### Building modules

A module exports start and optionally a stop function.

```js
export { start, stop };


const start = function (emitter) {
  return {};
};

const stop = function (instance) {
  // instance is what start returned
};
```

To start this module in your main file:

```js
import { Core } from "@eroc/core";
import * as exampleModule from "./exampleModule.js";

const core = new Core();
core.start(exampleModule);
```

Modules can only communicate via messages with other modules with the emitter received when start is called. It garantees that if a module tries to call something that doesn't exists or is broken, it won't break the module itself.

```js
emitter.on(EVENT_NAME, function (data) {

});

emitter.emit(EVENT_NAME, { a: 7 });
```

To avoid spelling mistakes, import event names from a common file called eventNames.js.


### Destroying modules

You might want to stop a module in some point, this can be easily done using the method `Core.stop()`.

```js
const exampleId = Core.start(exampleModule);
Core.stop(exampleId);
```

When you stop a module, the function `stop` will be called, if it exists.

### Comunicating between modules

Now, thinking about Twitter, everytime you tweet something, it should appear on your tweet list right? but since our modules don't talk directly to each other, let's use the emitter.

First of all, our `tweet` module should notify other modules that something has happened.

```js
export { start };

const start = function(emitter) {
  // For the sake of simplicity, use an interval
  setInterval(function() {
    emitter.emit(NEW_TWEET,  {
      author: 'Mauricio Soares',
      text: 'core is pretty #cool'
    });
  }, 5 * 1000)
};
```

Every 5 seconds, this module notifies everything that is listening to `NEW_TWEET` that something has happened. If nothing is listening to it, then nothing happens.

Our `tweet-list` is going to listen for this notifications.

```js
export { start };

const start = function (emitter) {
  emitter.on(NEW_TWEET, (data) => {
      // do something with the data
  });
};
```

Cool right? If one of those modules stop working, than it won't break the other one!



## Docs

#### Core.start( module, options )


- `module`  The module as a name-space (import * as exampleModule from "./exampleModule.js")
- `options` (function): The implementation of the module

__Usage__

```js
Core.start(exampleModule)
```


#### Core.stop( moduleInstanceId )

moduleInstanceId is what is returned by Core.start or the name used with Core.start

__Usage__

```js
Core.stop(moduleInstanceId);
```

## tl;dr

* Check out [this video](https://www.youtube.com/watch?v=s9tdZSa74jo) - Introduction (portuguese) (Old API)

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

* 1.1.0 introduce event recorder and player
* 1.0.0 stable release
* 0.15.0 major architecture change
* 2018-10-30   v0.13.0  remove deprecated startAll and stopAll 
* 2018-10-29   v0.12.0  Drop bower and publish on npm
* 2018                  Various changes
* 2015-06-15   v0.7.3   Refactor UMD
* 2015-05-14   v0.7.2   Hotfix with ID's
* 2015-02-15   v0.7.0   Deprecate `Core.stopAll`
* 2015-02-12   v0.6.0   Deprecate `Core.startAll`
* 2015-02-05   v0.5.0   Changes `x` to `use` in `Sandbox`
* 2015-01-17   v0.4.0   Add UMD
* 2015-01-15   v0.3.0   Ability to return values from init and destroy methods
* 2015-01-10   v0.2.1   Improve error messages
* 2014-12-30   v0.2.0   Isolation of DOM in modules
* 2014-12-21   v0.1.0   Release usable version

## License

(The MIT License)

Permission is hereby granted, free of charge, to any person obtaining
a copy of this software and associated documentation files (the
'Software'), to deal in the Software without restriction, including
without limitation the rights to use, copy, modify, merge, publish,
distribute, sublicense, and/or sell copies of the Software, and to
permit persons to whom the Software is furnished to do so, subject to
the following conditions:

The above copyright notice and this permission notice shall be
included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED 'AS IS', WITHOUT WARRANTY OF ANY KIND,
EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT.
IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY
CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT,
TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE
SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
