import { startShell } from "@wasmin/shell";
import { node as nodefs } from "@wasmin/node-fs-js";


export async function main() {
    await startShell(nodefs);
}
