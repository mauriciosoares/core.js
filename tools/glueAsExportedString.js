import fs from "fs";

const glueCode = fs.readFileSync("./dist/tempGlue.js", { encoding: "utf8"});
// we could minify the code

const asExportedJsString = `
export {workerGlueCode};
const workerGlueCode = ${JSON.stringify(glueCode)}`;
fs.writeFileSync("./dist/tempWorkerGlueCode.js", asExportedJsString);
