import { fromInput } from "./util.js";
import { FileSystemDirectoryHandle } from "./index.js";

export async function showDirectoryPicker(): Promise<FileSystemDirectoryHandle> {
    const input = document.createElement("input");
    input.type = "file";
    input.webkitdirectory = true;

    return new Promise((resolve) => {
        input.onchange = () => resolve(fromInput(input));
        input.click();
    });
}
