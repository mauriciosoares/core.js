export { storeWorkerCodeFromIIFEFile };
export { prepareWorkerCode };

import fs from "node:fs/promises";
import { prepareWorkerCode } from "./core.js";

const storeWorkerCodeFromIIFEFile = (sourcePath, destinationPath) => {
    return fs.readFile(sourcePath, {encoding: `utf-8`}).then(function (moduleCodeAsIIFE) {
        return fs.writeFile(destinationPath, prepareWorkerCode(moduleCodeAsIIFE));
    });
};
