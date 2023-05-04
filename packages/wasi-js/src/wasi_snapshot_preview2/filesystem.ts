import { Descriptor, DescriptorType, Filesize, OutputStream } from "./imports/filesystem.js";


export function writeViaStream(this: Descriptor, offset: Filesize): OutputStream {
    console.log("writeViaStream");
    let outStr: OutputStream = 0;
    return outStr;
}

export function appendViaStream(this: Descriptor): OutputStream{
    console.log("appendViaStream");
    let outStr: OutputStream = 0;
    return outStr;
}

export function dropDescriptor(this: Descriptor): void {
    console.log("dropDescriptor");
    return;
}

export function getType(this: Descriptor): DescriptorType {
    console.log("getType");
    let descriptorType: DescriptorType = 'unknown';
    return descriptorType;
}