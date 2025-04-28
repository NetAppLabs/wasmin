/**
 * Copyright 2025 NetApp Inc. All Rights Reserved.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 *
 * SPDX-License-Identifier: Apache-2.0
 */

let sea_root = "sea://assets"
let dist_pkg = "sea:/assets/@wasmin/node-shell/index.js";

const { createRequire, register } = require('node:module');
const { pathToFileURL } = require('node:url');
const { join } = require('node:path');
const { argv } = require('node:process');

const DEBUG=false;


function debugMsg(msg?: any, ...optionalParams: any[]): void {
  if (DEBUG) {
      console.debug(msg, ...optionalParams);
  }
}
debugMsg(`running from ${dist_pkg}`);

async function main() {

    try {
      let mod = require(dist_pkg);
      await mod.main();
    } catch (error) {
      console.error("Error in shell main function:", error);
      process.exit(0);
    }
}

async function writeFilesToTmp(){
  
}

debugMsg("pre main");
if (require.main === module) {
  debugMsg("running in main");
  debugMsg("argv: ", argv);
  let abortMain = false;
  if (argv.length > 2 ){
    if (argv[2] == "build-sea") {
      abortMain = true;
    }
  }
  if (!abortMain) {
    (async () => {
      await writeFilesToTmp();
      await main();
    })()
    .catch(err => console.log('Fatal error', err));
  }
} else {
  debugMsg("not running in main");
}
