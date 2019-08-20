export { start, stop };
import { NEW_TWEET } from "./eventNames.js";
// import { x, y } from "./dependencies.js";
// import { configuration } from "./configuration.js";


const start = function (emitter) {
  const instance = {
    list: document.getElementById(`tweet-list`),
  };

  emitter.on(NEW_TWEET, newTweet.bind(undefined, instance));
  return instance;
};

const stop = function (instance) {
  instance.list.innerHTML = ``;
};

const newTweet = function (instance, data) {
  const tweetElement = createElementWithTweet(data);
  instance.list.prepend(tweetElement);
};

const createElementWithTweet = function (data) {
  const li = document.createElement(`li`);
  li.className = `tweetlist-item`;
  li.innerHTML = `${data.author}<br>${data.tweet}`;
  return li;
};
