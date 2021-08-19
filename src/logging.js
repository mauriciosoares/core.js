export { useDefaultLogging };
import {ALL, ERROR} from "./core.js";


const useDefaultLogging = (core, { logger = console } = {}) => {
    // listen for all events
    core.on(ALL, ({ name, data/*, time*/ }) => {
        logger.debug(`event ${String(name)} data`, data);
    });

    
    core.on(ERROR, ({ phase, error/*, time*/ }) => {
        console.error(`Error during phase ${phase}`, error);
    });
};
