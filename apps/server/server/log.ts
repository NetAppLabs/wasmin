import { Console } from 'node:console';
import { default as fs } from 'node:fs';
import { isBun } from './util';


let logToConsole = false;

export function setLogToConsole(){
  logToConsole = true;
}

function isFileLog(){
  return !isBun() && !logToConsole;
}

let logger = console;

if (isFileLog()) {
  logger = new Console({
      //stdout: fs.createWriteStream("out."+HostManagerInstance.self.id+".log"),
      //stderr: fs.createWriteStream("err."+HostManagerInstance.self.id+".log"),
      stdout: fs.createWriteStream("out.log"),
      stderr: fs.createWriteStream("err.log"),
  });
}

export const Logger = logger;