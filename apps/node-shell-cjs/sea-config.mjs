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