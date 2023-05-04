import { Descriptor, StdioPreopens } from "./imports/preopens.js";


export function getStdio(): StdioPreopens {
    console.log("getStdio");
    let stdIoPreopens: StdioPreopens = {
        stdin: 0,
        stdout: 1,
        stderr: 2
    };
    return stdIoPreopens;
}
export function getDirectories(): [Descriptor, string][]{
    console.log("getDirectories");
    let desc: Descriptor = 0;
    let strs = "/";
    let ret: [Descriptor, string][] = [[
        desc,
        strs
    ]];
    return ret;
}
