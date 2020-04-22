export { start, stop };
import { NEW_TWEET } from "./eventNames.js";
// import { x, y } from "./dependencies.js";
// import { configuration } from "./configuration.js";


const start = function (emitter) {
  const form = document.getElementById(`tweet-form`);
  const input = form[`input`];

  const instance = {
    form,
    input,
    onSubmit: undefined,
    emitter,
  };
  instance.onSubmit = submit.bind(undefined, instance);

  form.addEventListener(`submit`, instance.onSubmit, false);

  return instance;
};

const stop = function (instance) {
  instance.form.removeEventListener(`submit`, instance.onSubmit, false);
};

const submit = function (instance, event) {
  event.preventDefault();

  const newTweet = instance.input.value;
  instance.input.value = ``;

  instance.emitter.emit(NEW_TWEET, {
    tweet: newTweet,
    author: `@omauriciosoares`,
  });
};
