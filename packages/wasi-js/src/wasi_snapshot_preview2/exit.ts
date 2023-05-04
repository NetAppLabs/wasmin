import { Result } from "./imports/exit.js";

export function exit(status: Result<void, void>): void {
    console.log("exit");
    return;
}