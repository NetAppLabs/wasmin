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

import * as fs from 'node:fs';
import * as path from 'node:path';

let assetsDir = "dist";

async function createSeaConfig() {
  await createAssetIndexfile();
  let fileAssets = await listAssetFiles();
  let confObj = {
    "main": "dist/index.js",
    "output": "sea-prep.blob",
    "disableExperimentalSEAWarning": true, 
    "useSnapshot": false, 
    "useCodeCache": false,
    "assets": fileAssets,
  }
  let seaConfName = "sea-config.json"
  fs.writeFileSync(seaConfName, JSON.stringify(confObj, null, 2));

}

async function createAssetIndexfile() {
  let fileAssets = await listAssetFiles();
  const indexFileName = "assetsIndex.json";
  const indexFileFullPath = path.join( assetsDir, indexFileName );
  fs.writeFileSync(indexFileFullPath, JSON.stringify(fileAssets, null, 2));
}

async function listAssetFiles() {
  let fileList = {}
  try {
      const files = await fs.promises.readdir( assetsDir );

      for( const file of files ) {
          const fullPath = path.join( assetsDir, file );
          const stat = await fs.promises.stat( fullPath );

          if( stat.isFile() ) {
              let fileKey = file;
              let fileValue = fullPath;
              fileList[fileKey] = fileValue;
          } else if( stat.isDirectory() ) {
              console.log( "'%s' is a directory.", file );
          }
      }
  }
  catch( e ) {
      console.error( "Error listing", e );
  }
  return fileList;
}

(async ()=>{
  await createSeaConfig()
})();