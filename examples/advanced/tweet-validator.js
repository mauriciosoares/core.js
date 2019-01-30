import {Core} from "../../src/core/core.js";
import {$, fetcher, events, errors} from "./projectCommon.js";


Core.register('tweet-list', function(sandbox) {
    return {
      init: function() {
        this.maxLength = 100;

        this.listen();
      },

      listen: function() {
        sandbox.listen(events.submitTweet, this.validateTweet, this);
      },

      validateTweet: function(data) {
        if (data.length > this.maxLength) {
          this.notify(events.error, errors.tweetTooLong);
          return;
        }
        this.notify(events.receiveTweet, data);
      }

    }
});
