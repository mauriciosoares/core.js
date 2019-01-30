import {Core} from "../../src/core/core.js";
// tweet-form.js
Core.register('tweet-counter', function(sandbox) {
    return {
      init: function() {
        this.counter = document.createElement("output")
        this.count = 0;
        this.updateCount();
        document.body.appendChild(this.counter);
        this.listen();
      },

      listen: function() {
        sandbox.listen('new-tweet', this.newTweet, this);
      },

      updateCount: function() {
          this.counter.textContent = this.count;
      },

      newTweet: function(data) {
          this.count++;
          this.updateCount();
      },

      destroy: function() {
          this.counter.remove();
      }
    }
}, true);
