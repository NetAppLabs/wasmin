import { getOriginPrivateDirectory, memory } from "../src";

import { TestsFileSystemHandle } from "../src";

const getMemoryRoot = async () => {
    const root = await getOriginPrivateDirectory(memory);
    return root;
};

TestsFileSystemHandle("memory", getMemoryRoot);
