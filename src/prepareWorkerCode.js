export { storeWorkerCodeFromIIFEFile };
export { prepareWorkerCode };

import { prepareWorkerCode } from "./core.js";
import fs from "fs/promises";

const storeWorkerCodeFromIIFEFile = (sourcePath, destinationPath) => {
    return fs.readFile(sourcePath, {encoding: "utf-8"}).then(function (moduleCodeAsIIFE) {
        return fs.writeFile(destinationPath, prepareWorkerCode(moduleCodeAsIIFE));
    })
}
