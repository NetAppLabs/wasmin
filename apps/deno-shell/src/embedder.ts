import * as embedder from "jsr:@nfnitloop/deno-embedder@1.4.9"

const options = {
    importMeta: import.meta,

    mappings: [
        {
            sourceDir: "../dist",
            destDir: "embed/static"
        },
    ]

}

if (import.meta.main) {
    await embedder.main({options})
}
