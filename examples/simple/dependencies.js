/* this file imports the common dependencies for the project and re exports as a common interface
common things: ui, network, etc ... */

export { fetcher, /* x, y, */ };
// import { x } from "z";
// import { y } from "w";

// like fetch but throws on 400+
const fetcher = (url, options) => {
    return fetch(url, options).then((response) => {
        if (!response.ok) {
            throw response;
        }
        return response;
    });
};


