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
//let dist_pkg = "/Users/tryggvil/node_modules/@wasmin/node-shell"
let modules_path = "/Users/tryggvil/node_modules";
let dist_pkg = "@wasmin/node-shell";
console.log(`running from ${dist_pkg}`);
const { createRequire, register } = require('node:module');
const { pathToFileURL } = require('node:url');

async function main() {

    /*import(dist_index).then(mod => {
      console.log("got dist_index");
      mod.main();
    });*/
  
    
    //let mod = await import(dist_pkg);
    //const newRequire = createRequire("/Users/tryggvil/node_modules");
    //register(modules_url);
    register('@wasmin/node-shell', pathToFileURL(modules_path));

    let mod = await import(dist_pkg);
    let esmMain = mod.main;
    
    console.log("got mod", mod);
    try {
      const res = await esmMain();
    } catch (error) {
      console.error("Error in shell main function:", error);
    }
  }
  
  main();