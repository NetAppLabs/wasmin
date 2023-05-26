
import { hello, uuid } from './wasi_reactor.js'

console.log(await hello("Mr. Reactor"));
console.log(await uuid());
