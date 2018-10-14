import {Core} from "../src/core/core.js";

// tweet-form.js
Core.register('tweet-form', function(sandbox) {
    return {
      init: function() {
        this.$form = $('#tweet-form');
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
