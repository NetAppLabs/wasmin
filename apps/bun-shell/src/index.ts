import { startShell } from "@wasmin/shell";
import { bun as bunFs } from "@wasmin/bun-fs-js";
import { getOriginPrivateDirectory } from "@wasmin/fs-js";

async function getRootFS() {    
    let nodePath = process.env.NODE_ROOT_DIR;
    if (!nodePath || nodePath == "") {
        nodePath = process.cwd();
    }
    
    return await getOriginPrivateDirectory(bunFs, nodePath, false);
}

(async () => {
    const bunRootFs = await getRootFS()
    await startShell(bunRootFs);
})();

