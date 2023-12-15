/*
const shell =require("@wasmin/shell");

// File class was added as experimental in node v19.2
const f = require("node:buffer");
const startShell = shell.startShell;

if (!globalThis.File) {
    // @ts-ignore
    globalThis.File = File;
}
*/


//let dist_dir = "file:///tmp/dist-node";
//let dist_index = `${dist_dir}/index.js`;
let sea_root = "sea://assets"
//let dist_pkg = "@wasmin/node-shell";
let dist_pkg = "@wasmin/node-shell";
//let dist_pkg = "sea://assets/@wasmin/node-shell/index.js";

console.log(`running from ${dist_pkg}`);
const { createRequire, register } = require('node:module');
const { pathToFileURL } = require('node:url');
const { join } = require('path');

async function main() {

    /*import(dist_index).then(mod => {
      console.log("got dist_index");
      mod.main();
    });*/
  
    
    //let mod = await import(dist_pkg);
    //const newRequire = createRequire("/");
    //register(modules_url);
    //register('@wasmin/node-shell', pathToFileURL(modules_path));
    //register('@wasmin/node-shell', pathToFileURL(join(__dirname, "node_modules")));
    //register('@wasmin/node-shell', pathToFileURL(__filename));
    //register('@wasmin/node-shell', pathToFileURL(sea_root));

    //let mod = undefined;
    //let esmMain = mod.main;
    /*let esmMain = function() {
      console.log("testing");
    }*/
    try {
      let mod = await import(dist_pkg);
      console.log("got mod", mod);
      
      const esmMain = mod.main;
      if (esmMain) {
        console.log("esmMain: ", esmMain);
        const res = await esmMain();
      }
    } catch (error) {
      console.error("Error in shell main function:", error);
      process.exit(0);
    }
}
  
function mainDummy() {
  console.log("output from mainDummy");
}

main();
