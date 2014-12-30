// extending stuff in core
Core.extend('$', jQuery);

// tweet-form.js
(function(Core) {
  Core.register('tweet-form', function(sandbox) {
    return {
      init: function() {
        this.$form = sandbox.x('$')('#tweet-form');
        this.$input = this.$form.find('input');

        this.addListeners();
      },

      addListeners: function() {
        this.$form.on('submit', this.onSubmit.bind(this));
      },

      onSubmit: function(e) {
        e.preventDefault();

        var newTweet = this.$input[0].value;
        this.$input[0].value = '';

        this.notify(newTweet);
      },

      notify: function(tweet) {
        sandbox.notify({
          type: 'new-tweet',
          data: {
            tweet: tweet,
            author: '@omauriciosoares'
          }
        });
      }
    }
  });
} (Core));

// tweet-list.js
(function(Core) {
  Core.register('tweet-list', function(sandbox) {
    return {
      init: function() {
        this.$list = sandbox.x('$')('#tweet-list');

        this.listen();
      },

      listen: function() {
        sandbox.listen('new-tweet', this.newTweet, this);
      },

      newTweet: function(data) {
        var newTweetHtml = this.getHtml(data);

        this.$list.prepend(newTweetHtml);
      },

      getHtml: function(data) {
        var li = sandbox.x('$')('<li class="tweetlist-item">');
        li.append(data.author + '<br>' + data.tweet);

        return li;
      }
    }
  });
} (Core));

// boot.js
Core.start('tweet-form');
Core.start('tweet-list');
