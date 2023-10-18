const shell =require("@wasmin/shell");

// File class was added as experimental in node v19.2
const f = require("node:buffer");
const startShell = shell.startShell;

if (!globalThis.File) {
    // @ts-ignore
    globalThis.File = File;
}

async function main() {
    try {
      const res = await startShell();
    } catch (error) {
      console.error("Error in shell main function:", error);
    }
  }
  
  main();