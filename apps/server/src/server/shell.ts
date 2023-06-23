import { isNode } from "./util";

export async function startLocalShell() {
    if (isNode()) {
        const nodeShell = await import("./node_shell");
        await nodeShell.startLocalShell();
    }
}
