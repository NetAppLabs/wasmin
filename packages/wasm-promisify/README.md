

# wasm-promisify

 Allows transparent use an unmodified WebAssembly.Module and adapt it to be usable with JSPI - [https://v8.dev/blog/jspi](https://v8.dev/blog/jspi) and thereby allowing async imports and exports.

## Notes:

 This works currently only if experimental-wasm-stack-switching is enabled e.g. with --experimental-wasm-stack-switching on node/deno/v8

## instanciatePromisified

 Takes in a WebAssembly.Module with desired importObject and re-wires all imports and exports to be async capable
 with JSPI (JavaScript Promise Integration) - https://v8.dev/blog/jspi
 Wasm is rewriteen with two extra modules:
 Wasm Adapter:
     Which is the returned object with rewritten exports.
 Original Wasm is kept intact.
 Wasm Proxy:
     An extra object with is to handle imports from original wasm and bass them back into wasm adapter to be handled
     and then passed onto the host in an async way.

## diagram
                                                                                                           
                      +--------------------+          +--------------------+       +--------------------+
                      |                    |          |                    |       |                    |
                      |                    |          |                    |       |                    |
     export --->      |       wasm         |   ---->  |      original      | ----> |       wasm         |
                      |       adapter      |          |      wasm          |       |       proxy        |
                      |                    |          |                    |       |                    
                      |                    |          |                    |       |                    |
                      +--------------------+          +--------------------+       +--------------------+
                                ^                                                           |            
                                |                         call indirect                     |            
                                |------------------------------------------------------------            
                                                                                                         
