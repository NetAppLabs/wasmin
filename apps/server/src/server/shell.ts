import { isNode } from "./util.js";

export async function startLocalShell() {
    const nodeShell = await import("./node_shell.js");
    await nodeShell.startLocalShell();
}
