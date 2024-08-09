//import * as embedder from "https://deno.land/x/embedder/mod.ts"
//import * as embedder from "https://deno.land/x/embedder@v1.1.1/mod.ts";

//import { ESBuild } from "https://deno.land/x/embedder/plugins/esbuild.ts"
// Need to use master to use unreleased features
import * as embedder from 'https://github.com/NfNitLoop/deno-embedder/raw/main/src/mod.ts'
//import * as embedder from "jsr:@nfnitloop/deno-embedder@1.4.8"


const options = {
    importMeta: import.meta,

    mappings: [
        {
            sourceDir: "../dist",
            destDir: "embed/static"
        },
        /*{
            sourceDir: "code",
            destDir: "embed/code",
            plugin: new ESBuild({
                entryPoints: ["app.ts"],
            })
        }*/
    ]

}
//export {embedder}

if (import.meta.main) {
    await embedder.main({options})
}
