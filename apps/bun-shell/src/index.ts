import { startShell } from "@wasmin/shell";
import { bun } from "@wasmin/bun-fs-js";

(async () => {    
    await startShell(bun);
})();

