import { startShell } from "@netapplabs/shell";
import { bun } from "@netapplabs/bun-fs-js";

(async () => {    
    await startShell(bun);
})();

