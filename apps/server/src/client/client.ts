/*
const res = await fetch('http://127.0.0.1:5001/say-hello/James', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ greeting: 'Hello' }),
});
const t = await res.text();
console.log(t);
*/

import { Process } from "../server/types.js";

const p: Process = {
    cmd: "http://test.com/test.wasm",
    status: "running",
    env: {},
    args: [],
    stdin: "default",
    stdout: "default",
    stderr: "default",
    mounts: {},
    features: {},
};

const res = await fetch("http://127.0.0.1:5001/processes", {
    method: "POST",
    //headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(p),
});
const t = await res.text();

console.log(t);
//console.log(body);
