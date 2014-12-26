# Core.js

__Core.js__ is a concept introduced by Nicholas C. Zakas in this [video](https://www.youtube.com/watch?v=b5pFv9NB9fs)

It helps you creating scalable applications written in Javascript, giving you some structure and patterns to keep everything separated.

## The Idea

Conceptually, everything in your application is a module, and your modules should work independently from each other, so if one module breaks, the others should not.

A module should never talk directly to another module, for that you use a combination of listeners and notifications.

## Getting Started

So let's think about the twitter page, and how we could re-build it using the __Core.js__ concept

![Twitter Modules](https://cloud.githubusercontent.com/assets/2321259/5558085/3caa2e2c-8d00-11e4-8eba-4613b593193f.png)

Everything inside a red square is a module, so they work in a way that they don't depend from any other modules, and they should be programmed that way as well.

Let's start with the tweet module.

### Building modules

```js
Core.register('tweet', function(sandbox) {
  return {
    init: function() {
      console.log('starting tweet module');
    }
  }
});
```

This way you can register a new module, and the method `init` will be called once the module is started, if it exists.

```js
Core.start('tweet'); // Log: starting tweet module
```

For every module you have an enviroment called sandbox, this is the only guy your module will ever gonna speak to.

It garantees that if your module tries to call something that doesn't exists or is broken, it won't break the module itself.

Now let's think about the tweet list, which fetches all tweets from your timeline.

```js
Core.register('tweet-list', function(sandbox) {
  return {
    init: function() {

    }
  }
});
```

If you have multiple modules you can start everything using `Core.startAll();`, and everything will be started. But if you need some specific order for starting your modules, you can call the modules you want first, and then use `Core.startAll()`.

### Destroying modules

You might want to stop a module in some point, this can be easily done using the method `Core.stop()`.

```js
Core.register('tweet-list', function(sandbox) {
  return {
    destroy: function() {
      console.log('Module destroyed');
    }
  }
});

Core.start('tweet-list');
Core.stop('tweet-list'); // Log: Module destroyed
```

When you stop a module, the method `destroy` will be called, if it exists.

### Comunicating between modules

Now, thinking about Twitter, everytime you tweet something, it should appear on your tweet list right? but since our modules don't talk directly to each other, let's use `sandbox` to do this for us:

First of all, our `tweet` module should notify other modules that something has happened.

```js
Core.register('tweet', function(sandbox) {
  return {
    init: function(sandbox) {
      // For the sake of simplicity, I'm gonna use a interval to submit tweets
      setInterval(function() {
        sandbox.notify({
          type: 'new-tweet',
          data: {
            author: 'Mauricio Soares',
            text: 'Core.js is pretty #cool'
          }
        })
      }, 5 * 1000)
    }
  }
});
```

Every 5 seconds, this module notifies everything that is listening to `new-tweet` that something has happened. If nothing is listening to it, than nothing happens.

Our `tweet-list` is gonna listen to this notifications.

```js
Core.register('tweet-list', function(sandbox) {
  return {
    init: function() {
      sandbox.listen('new-tweet', this.newTweet);
    },

    newTweet: function(data) {
      // does something with data
    }
  }
});
```

Cool right? If one of those modules stop working, than it won't break the other module!

### Extending Core

__Core.js__ simple gives you an structure to scale your apps, but it won't give you the tools to build it, since we don't want to reinvent the wheel, it provides you a way to extend its functionalities.

Modules should not talk to external libreries as well, they will ask permission to `sandbox` before that, and `sandbox` will then talk to `Core` to check if that extension actually exists, let's see:

```js
// lets suppose we have jquery loaded before this
Core.extend('$', jQuery);

Core.register('tweet', function(sandbox) {
  return {
    init: function() {
      sandbox.x('$')('#tweet').on('click', this.newTweet);
    },

    newTweet: function() {
      // handles click
    }
  };
});
```

Using the method `x` from `sandbox`, it gives you access to all extensions from Core, without talking directly to it.

You might think: _"Why do that? it's only increasing the code"_. But since we are talking about consistency, and maybe a code that will be updated by other programmers, this is a way we can keep things standardized, and again, conpectually a module should not talk to anything else but the `sandbox`.

### Last thoughts

This is basically how Core.js works, below there's the documentation of methods and parameters.

## Docs

#### Core.register( moduleName, constructor )
Register a new module.

- `moduleName` (string): The name of the module
- `constructor` (function): The implementation of the module

__Usage__

```js
Core.register('module', function() {})
```

#### Core.start( moduleName )
Starts the given module.

- `moduleName` (string): The name of the module

__Usage__

```js
Core.start('module');
```


#### Core.stop( moduleName )
Stops the given module.

- `moduleName` (string): The name of the module

__Usage__

```js
Core.stop('module');
```

#### Core.startAll()
Starts all modules.

__Usage__

```js
Core.startAll();
```

#### Core.stopAll()
Stops all modules.

__Usage__

```js
Core.stopAll();
```

#### Core.extend( newExtension, implementation )
Extends Core functionalities

- `newExtension` (string): The name of the extension
- `implementation` (function|string|number|boolean|array): The implementation of the extension

__Usage__

```js
Core.extend('$', jQuery);
```

#### sandbox.listen( notification, callback, context, force )
Listens to other modules notifications

- `notification` (string | array): The name of the notification you are listening to
- `callback` (function): The callback when the notification is triggered
- `context` (object):


## Maintainer

- Mauricio Soares - <http://github.com/mauriciosoares>

## Contributing

1. [Fork](http://help.github.com/forking/) Core.js
2. Create a topic branch - `git checkout -b my_branch`
3. Push to your branch - `git push origin my_branch`
4. Send me a [Pull Request](https://help.github.com/articles/using-pull-requests)
5. That's it!

Please respect the indentation rules and code style.

Use 2 spaces, not tabs.

New features? Would you mind testing it? :)

## Testing

You need [NodeJS](http://nodejs.org/) installed on your machine

1. Run `npm install`
2. Run `npm install -g grunt-cli` to install the grunt command
3. Run `npm test`

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
