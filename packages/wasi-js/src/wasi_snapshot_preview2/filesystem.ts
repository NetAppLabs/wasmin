import { Descriptor, DescriptorType, Filesize, OutputStream } from "./imports/filesystem.js";


export function writeViaStream(t: Descriptor, offset: Filesize): OutputStream {
    console.log("writeViaStream");
    let outStr: OutputStream = 0;
    return outStr;
}

export function appendViaStream(t: Descriptor): OutputStream{
    console.log("appendViaStream");
    let outStr: OutputStream = 0;
    return outStr;
}

export function dropDescriptor(t: Descriptor): void {
    console.log("dropDescriptor");
    return;
}

export function getType(t: Descriptor): DescriptorType {
    console.log("getType");
    let descriptorType: DescriptorType = 'unknown';
    return descriptorType;
}