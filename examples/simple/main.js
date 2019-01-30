import {Core} from "../../src/core/core.js";
import "./tweet-form.js";
import "./tweet-list.js";
import "./tweet-counter.js";



// boot.js
Core.start('tweet-counter', 'first counter');
Core.start('tweet-form');
//Core.start();
Core.start('tweet-list');
Core.start('tweet-counter', 'second counter');
