/*
this file exports the common interface for the entire project
common things: ui, network, event symbols, etc ...
*/

export {$, fetcher, events, errors}

const $ = window.$;

// like fetch but throws on 400+
const fetcher = (url, options) => {
    return fetch(url, options).then((response) => {
        if (!response.ok) {
            throw response;
        }
        return response;
    });
};

const events = {
    receiveTweet: Symbol(),
    submitTweet: Symbol()
};

const errors = {
    tweetTooLong: Symbol()
};
