
import { hello, uuid } from './wasi_reactor.js'

console.log(await hello("Mr. Reactor"));
console.log(await hello("there"));
console.log(await hello("to one"));
console.log(await hello("to all"));
console.log("uuid:", await uuid());
console.log("done");
