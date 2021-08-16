export { start, stop };
import { NEW_TWEET } from "./eventNames.js";
// import { x, y } from "./dependencies.js";
// import { configuration } from "./configuration.js";


const start = function (emitter, initialCount) {
  const counter = document.createElement(`output`);
  const instance = {
    counter,
    count: initialCount,
  };
  updateCount(instance);
  document.body.appendChild(counter);
  emitter.on(NEW_TWEET, newTweet.bind(undefined, instance));
  return instance;
};

const stop = function (instance) {
  instance.counter.remove();
};

const updateCount = function (instance) {
  instance.counter.textContent = `Number of tweets: ${instance.count}`;
};

const newTweet = function (instance) {
  instance.count += 1;
  updateCount(instance);
};
