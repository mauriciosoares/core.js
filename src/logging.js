export { useDefaultLogging };
import {ALL, ERROR} from "./core.js";


const useDefaultLogging = (core, { logger = console } = {}) => {
    // listen for all events
    core.on(ALL, ({ name, data, time }) => {
        const timeString = new Date(time).toISOString();
        logger.debug(`${timeString} event ${String(name)} with data`, data);
    });

    
    core.on(ERROR, ({ time, phase, error }) => {
        const timeString = new Date(time).toISOString();
        console.error(`Error during phase ${phase} at ${timeString}`, error);
    });
};
