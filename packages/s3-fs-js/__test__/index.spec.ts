import test from 'ava'

import { getDirectoryHandleByURL, RegisterProvider, FileSystemDirectoryHandle, FileSystemFileHandle } from '@netapplabs/fs-js';
import { s3 } from '@netapplabs/s3-fs-js';

const s3Url = process.env.S3_URL || 's3://127.0.0.1/invalid/';

RegisterProvider("s3", s3);

let root: FileSystemDirectoryHandle;

async function getRootHandle(): Promise<FileSystemDirectoryHandle> {
  root = await getDirectoryHandleByURL(s3Url, false);
  return root;
}

test.serial('should have correct properties for directory', async (t) => {
  const rootHandle = await getRootHandle();
  const dirHandle = await rootHandle.getDirectoryHandle('first') as FileSystemDirectoryHandle;
  t.is(dirHandle.kind, 'directory');
  t.is(dirHandle.name, 'first');
})

test.serial('should have correct properties for file', async (t) => {
  const rootHandle = await getRootHandle();
  const dirHandle = await rootHandle.getFileHandle('annar') as FileSystemFileHandle;
  t.is(dirHandle.kind, 'file');
  t.is(dirHandle.name, 'annar');
})

test.serial('should be same entry as self for directory', async (t) => {
  const rootHandle = await getRootHandle();
  const dirHandle = await rootHandle.getDirectoryHandle('first');
  const dirHandle2 = await rootHandle.getDirectoryHandle('first');
  t.true(await dirHandle.isSameEntry(dirHandle));
  t.true(await dirHandle.isSameEntry(dirHandle2));
  t.true(await dirHandle2.isSameEntry(dirHandle));
})

test.serial('should not be same entry as others for directory', async (t) => {
  const rootHandle = await getRootHandle();
  const fileHandle = await rootHandle.getFileHandle('annar');
  const dirHandle = await rootHandle.getDirectoryHandle('first');
  t.false(await fileHandle.isSameEntry(dirHandle));
  t.false(await rootHandle.isSameEntry(dirHandle));
  t.false(await dirHandle.isSameEntry(fileHandle));
  t.false(await dirHandle.isSameEntry(rootHandle));
})

test.serial('should be same entry as self for file', async (t) => {
  const rootHandle = await getRootHandle();
  const fileHandle = await rootHandle.getFileHandle('annar');
  const fileHandle2 = await rootHandle.getFileHandle('annar');
  t.true(await fileHandle.isSameEntry(fileHandle));
  t.true(await fileHandle.isSameEntry(fileHandle2));
  t.true(await fileHandle2.isSameEntry(fileHandle));
})

test.serial('should not be same entry as others for file', async (t) => {
  const rootHandle = await getRootHandle();
  const fileHandle = await rootHandle.getFileHandle('annar');
  const fileHandle2 = await rootHandle.getFileHandle('3');
  t.false(await fileHandle.isSameEntry(fileHandle2));
  t.false(await rootHandle.isSameEntry(fileHandle2));
  t.false(await fileHandle2.isSameEntry(fileHandle));
  t.false(await fileHandle2.isSameEntry(rootHandle));
})

test.serial('should be granted read permission when querying on directory', async (t) => {
  const rootHandle = await getRootHandle();
  const dirHandle = await rootHandle.getDirectoryHandle('first') as FileSystemDirectoryHandle;
  const perm = await dirHandle.queryPermission({mode: 'read'});
  t.is(perm, 'granted');
})

test.serial('should be granted readwrite permission when querying on directory', async (t) => {
  const rootHandle = await getRootHandle();
  const dirHandle = await rootHandle.getDirectoryHandle('first') as FileSystemDirectoryHandle;
  const perm = await dirHandle.queryPermission({mode: 'readwrite'});
  t.is(perm, 'granted');
})

test.serial('should be granted read permission when querying on read-only directory', async (t) => {
  const rootHandle = await getRootHandle();
  const dirHandle = await rootHandle.getDirectoryHandle('quatre') as FileSystemDirectoryHandle;
  const perm = await dirHandle.queryPermission({mode: 'read'});
  t.is(perm, 'granted');
})

/*
test.serial('should be denied readwrite permission when querying on read-only directory', async (t) => {
  const rootHandle = await getRootHandle();
  const dirHandle = await rootHandle.getDirectoryHandle('quatre') as FileSystemDirectoryHandle;
  const perm = await dirHandle.queryPermission({mode: 'readwrite'});
  t.is(perm, 'denied');
})
*/

test.serial('should be granted read permission when requesting on directory', async (t) => {
  const rootHandle = await getRootHandle();
  const dirHandle = await rootHandle.getDirectoryHandle('first') as FileSystemDirectoryHandle;
  const perm = await dirHandle.requestPermission({mode: 'read'});
  t.is(perm, 'granted');
})

test.serial('should be granted readwrite permission when requesting on directory', async (t) => {
  const rootHandle = await getRootHandle();
  const dirHandle = await rootHandle.getDirectoryHandle('first') as FileSystemDirectoryHandle;
  const perm = await dirHandle.requestPermission({mode: 'readwrite'});
  t.is(perm, 'granted');
})

test.serial('should be granted read permission when querying on file', async (t) => {
  const rootHandle = await getRootHandle();
  const fileHandle = await rootHandle.getFileHandle('annar') as FileSystemFileHandle;
  const perm = await fileHandle.queryPermission({mode: 'read'});
  t.is(perm, 'granted');
})

test.serial('should be granted readwrite permission when querying on file', async (t) => {
  const rootHandle = await getRootHandle();
  const fileHandle = await rootHandle.getFileHandle('annar') as FileSystemFileHandle;
  const perm = await fileHandle.queryPermission({mode: 'readwrite'});
  t.is(perm, 'granted');
})

test.serial('should be granted read permission when querying on read-only file', async (t) => {
  const rootHandle = await getRootHandle();
  const fileHandle = await rootHandle.getFileHandle('3') as FileSystemFileHandle;
  const perm = await fileHandle.queryPermission({mode: 'read'});
  t.is(perm, 'granted');
})

/*
test.serial('should be denied readwrite permission when querying on read-only file', async (t) => {
  const rootHandle = await getRootHandle();
  const fileHandle = await rootHandle.getFileHandle('3') as FileSystemFileHandle;
  const perm = await fileHandle.queryPermission({mode: 'readwrite'});
  t.is(perm, 'denied');
})
*/

test.serial('should be granted read permission when requesting on file', async (t) => {
  const rootHandle = await getRootHandle();
  const fileHandle = await rootHandle.getFileHandle('annar') as FileSystemFileHandle;
  const perm = await fileHandle.requestPermission({mode: 'read'});
  t.is(perm, 'granted');
})

test.serial('should be granted readwrite permission when requesting on file', async (t) => {
  const rootHandle = await getRootHandle();
  const fileHandle = await rootHandle.getFileHandle('annar') as FileSystemFileHandle;
  const perm = await fileHandle.requestPermission({mode: 'readwrite'});
  t.is(perm, 'granted');
})

test.serial('should iterate through directory', async (t) => {
  const rootHandle = await getRootHandle();
  const expectedEntries = new Map<string, string>([
    ['3', 'file'],
    ['annar', 'file'],
    ['quatre', 'directory'],
    ['first', 'directory'],
  ]);
  let i = 0;
  for await (const [ key, value ] of rootHandle) {
    if (i >= expectedEntries.size) {
      t.fail('iterated past expected number of entries');
      break;
    }
    const expectedKind = expectedEntries.get(key);
    if (!expectedKind) {
      t.fail('unexpected entry: ' + key);
      break;
    }
    t.is(value.kind.toString(), expectedKind);
    t.is(value.name, key);
    i++
  }
  t.is(i, expectedEntries.size);
})

test.serial('should iterate through subdirectory', async (t) => {
  const rootHandle = await getRootHandle();
  const dirHandle = await rootHandle.getDirectoryHandle('first') as FileSystemDirectoryHandle;
  const expectedEntries = [
    {key: 'comment', value: {kind: 'file', name: 'comment'}},
  ];
  let i = 0;
  for await (const [ key, value ] of dirHandle) {
    if (i >= expectedEntries.length) {
      t.fail('iterated past expected number of entries');
      break;
    }
    t.is(key, expectedEntries[i].key);
    t.is(value.kind.toString(), expectedEntries[i].value.kind);
    t.is(value.name, expectedEntries[i].value.name);
    i++
  }
  t.is(i, expectedEntries.length);
})


test.serial('should iterate through subsubdirectory', async (t) => {
  const rootHandle = await getRootHandle();
  const dirHandle = await rootHandle.getDirectoryHandle('first') as FileSystemDirectoryHandle;
  const subdirHandle = await dirHandle.getDirectoryHandle('place', {create: true}) as FileSystemDirectoryHandle;
  const expectedEntries = [];
  let i = 0;
  for await (const [ _key, _value ] of subdirHandle) {
    if (i >= expectedEntries.length) {
      t.fail('iterated past expected number of entries');
      break;
    }
    i++
  }
  t.is(i, expectedEntries.length);
  await dirHandle.removeEntry('place');
})


test.serial('should iterate through entries', async (t) => {
  const rootHandle = await getRootHandle();
  const expectedEntries = new Map<string, string>([
    ['3', 'file'],
    ['annar', 'file'],
    ['quatre', 'directory'],
    ['first', 'directory'],
  ]);
  let i = 0;
  for await (const [ key, value ] of rootHandle.entries()) {
    if (i >= expectedEntries.size) {
      t.fail('iterated past expected number of entries');
      break;
    }
    const expectedKind = expectedEntries.get(key);
    if (!expectedKind) {
      t.fail('unexpected entry: ' + key);
      break;
    }
    t.is(value.kind.toString(), expectedKind);
    t.is(value.name, key);
    i++
  }
  t.is(i, expectedEntries.size);
})

test.serial('should iterate through subdirectory entries', async (t) => {
  const rootHandle = await getRootHandle();
  const dirHandle = await rootHandle.getDirectoryHandle('quatre') as FileSystemDirectoryHandle;
  const expectedEntries = [
    {key: 'points', value: {kind: 'file', name: 'points'}},
  ];
  let i = 0;
  for await (const [ key, value ] of dirHandle.entries()) {
    if (i >= expectedEntries.length) {
      t.fail('iterated past expected number of entries');
      break;
    }
    t.is(key, expectedEntries[i].key);
    t.is(value.kind.toString(), expectedEntries[i].value.kind);
    t.is(value.name, expectedEntries[i].value.name);
    i++
  }
  t.is(i, expectedEntries.length);
})

test.serial('should iterate through keys', async (t) => {
  const rootHandle = await getRootHandle();
  const expectedKeys = new Set<string>(['3', 'annar', 'quatre', 'first']);
  let i = 0;
  for await (const key of rootHandle.keys()) {
    if (i >= expectedKeys.size) {
      t.fail('iterated past expected number of keys');
      break;
    }
    t.true(expectedKeys.has(key));
    i++
  }
  t.is(i, expectedKeys.size);
})

test.serial('should iterate through subdirectory keys', async (t) => {
  const rootHandle = await getRootHandle();
  const dirHandle = await rootHandle.getDirectoryHandle('quatre') as FileSystemDirectoryHandle;
  const expectedKeys = ['points'];
  let i = 0;
  for await (const key of dirHandle.keys()) {
    if (i >= expectedKeys.length) {
      t.fail('iterated past expected number of keys');
      break;
    }
    t.is(key, expectedKeys[i++]);
  }
  t.is(i, expectedKeys.length);
})

test.serial('should iterate through values', async (t) => {
  const rootHandle = await getRootHandle();
  const expectedValues = new Map<string, string>([
    ['3', 'file'],
    ['annar', 'file'],
    ['quatre', 'directory'],
    ['first', 'directory'],
  ]);
  let i = 0;
  for await (const { kind, name } of rootHandle.values()) {
    if (i >= expectedValues.size) {
      t.fail('iterated past expected number of values');
      break;
    }
    const expectedKind = expectedValues.get(name);
    if (!expectedKind) {
      t.fail('unexpected value: ' + name);
      break;
    }
    t.is(kind.toString(), expectedKind);
    i++
  }
  t.is(i, expectedValues.size);
})

test.serial('should iterate through subdirectory values', async (t) => {
  const rootHandle = await getRootHandle();
  const dirHandle = await rootHandle.getDirectoryHandle('first') as FileSystemDirectoryHandle;
  const expectedValues = [
    {kind: 'file', name: 'comment'},
  ];
  let i = 0;
  for await (const { kind, name } of dirHandle.values()) {
    if (i >= expectedValues.length) {
      t.fail('iterated past expected number of values');
      break;
    }
    t.is(kind.toString(), expectedValues[i].kind);
    t.is(name, expectedValues[i].name);
    i++
  }
  t.is(i, expectedValues.length);
})

test.serial('should return error when getting unknown directory', async (t) => {
  const rootHandle = await getRootHandle();
  const err = await t.throwsAsync(rootHandle.getDirectoryHandle('unknown'));
  //t.is(err?.message, 'Directory "unknown" not found');
  t.is(err?.name, 'NotFoundError');
})

test.serial('should return directory when getting existing directory', async (t) => {
  const rootHandle = await getRootHandle();
  const dirHandle = await rootHandle.getDirectoryHandle('first');
  t.is(dirHandle.kind, 'directory');
  t.is(dirHandle.name, 'first');
})

test.serial('should return directory when creating new directory', async (t) => {
  const rootHandle = await getRootHandle();
  const dirHandle = await rootHandle.getDirectoryHandle('newlywed', {create: true});
  t.is(dirHandle.kind, 'directory');
  t.is(dirHandle.name, 'newlywed');
  await rootHandle.removeEntry(dirHandle.name);
})

test.serial('should return directory when "creating" existing directory', async (t) => {
  const rootHandle = await getRootHandle();
  const dirHandle = await rootHandle.getDirectoryHandle('first', {create: true});
  t.is(dirHandle.kind, 'directory');
  t.is(dirHandle.name, 'first');
})

test.serial('should return error when getting unknown file', async (t) => {
  const rootHandle = await getRootHandle();
  const err = await t.throwsAsync(rootHandle.getFileHandle('unknown'));
  //t.is(err?.message, 'File "unknown" not found');
  t.is(err?.name, 'NotFoundError');
})

test.serial('should return file when getting existing file', async (t) => {
  const rootHandle = await getRootHandle();
  for (const name of ['annar', '3']) {
    const dirHandle = await rootHandle.getFileHandle(name);
    t.is(dirHandle.kind, 'file');
    t.is(dirHandle.name, name);
  }
})

test.serial('should return file when creating new file', async (t) => {
  const rootHandle = await getRootHandle();
  const fileHandle = await rootHandle.getFileHandle('newfoundland', {create: true});
  t.is(fileHandle.kind, 'file');
  t.is(fileHandle.name, 'newfoundland');
  await rootHandle.removeEntry(fileHandle.name);
})

test.serial('should return file when "creating" existing file', async (t) => {
  const rootHandle = await getRootHandle();
  for (const name of ['annar', '3']) {
    const dirHandle = await rootHandle.getFileHandle(name, {create: true});
    t.is(dirHandle.kind, 'file');
    t.is(dirHandle.name, name);
  }
})

// test.serial('should return error when removing non-empty directory', async (t) => {
//   const rootHandle = await getRootHandle();
//   const err = await t.throwsAsync(rootHandle.removeEntry('first'));
//   t.is(err?.message, 'Directory "first" is not empty');
// })

test.serial('should return error when removing unknown entry', async (t) => {
  const rootHandle = await getRootHandle();
  const err = await t.throwsAsync(rootHandle.removeEntry('unknown'));
  //t.is(err?.message, 'Entry "unknown" not found');
  t.is(err?.name, 'NotFoundError');
})

test.serial('should succeed when removing file', async (t) => {
  const rootHandle = await getRootHandle();
  const fileHandle = await rootHandle.getFileHandle('doomed', {create: true});
  await t.notThrowsAsync(rootHandle.removeEntry(fileHandle.name));
})

test.serial('should return error when removing unknown entry recursively', async (t) => {
  const rootHandle = await getRootHandle();
  const err = await t.throwsAsync(rootHandle.removeEntry('unknown', {recursive: true}));
  //t.is(err?.message, 'Entry "unknown" not found');
  t.is(err?.name, 'NotFoundError');
})

// test.serial('should succeed when removing recursively non-empty directory', async (t) => {
//   const rootHandle = await getRootHandle();
//   const dirHandle = await rootHandle.getDirectoryHandle('condemned', {create: true});
//   await t.notThrowsAsync(dirHandle.getFileHandle('asylum', {create: true}));
//   await t.notThrowsAsync(rootHandle.removeEntry(dirHandle.name, {recursive: true}));
// })

test.serial('should succeed when removing recursively empty directory', async (t) => {
  const rootHandle = await getRootHandle();
  const dirHandle = await rootHandle.getDirectoryHandle('terminal', {create: true});
  await t.notThrowsAsync(rootHandle.removeEntry(dirHandle.name, {recursive: true}));
})

// test.serial('should return null when resolving unknown directory', async (t) => {
//   const rootHandle = await getRootHandle();
//   const resolved = await rootHandle.resolve({kind: 'directory', name: 'unknown'} as any);
//   t.deepEqual(resolved, null);
// })

// test.serial('should return null when resolving unknown file', async (t) => {
//   const rootHandle = await getRootHandle();
//   const resolved = await rootHandle.resolve({kind: 'file', name: 'unknown'} as any);
//   t.deepEqual(resolved, null);
// })

// test.serial('should return non-null when resolving known directory', async (t) => {
//   const rootHandle = await getRootHandle();
//   const resolved = await rootHandle.resolve({kind: 'directory', name: 'first'} as any);
//   t.deepEqual(resolved, ['first']);
// })

// test.serial('should return non-null when resolving known directory using handle', async (t) => {
//   const rootHandle = await getRootHandle();
//   const dirHandle = await rootHandle.getDirectoryHandle('first');
//   const resolved = await rootHandle.resolve(dirHandle);
//   t.deepEqual(resolved, ['first']);
// })

// test.serial('should return non-null when resolving known file', async (t) => {
//   const rootHandle = await getRootHandle();
//   for (const name of ['annar', '3']) {
//     const resolved = await rootHandle.resolve({kind: 'file', name} as any);
//     t.deepEqual(resolved, [name]);
//   }
//   for (const {dir, name} of [{dir: 'first', name: 'comment'}, {dir: 'quatre', name: 'points'}]) {
//     const resolved = await rootHandle.resolve({kind: 'file', name} as any);
//     t.deepEqual(resolved, [dir, name]);
//   }
// })

// test.serial('should return non-null when resolving known file using handle', async (t) => {
//   const rootHandle = await getRootHandle();
//   for (const name of ['annar', '3']) {
//     const fileHandle = await rootHandle.getFileHandle(name);
//     const resolved = await rootHandle.resolve(fileHandle);
//     t.deepEqual(resolved, [name]);
//   }
//   for (const {dir, name} of [{dir: 'first', name: 'comment'}, {dir: 'quatre', name: 'points'}]) {
//     const dirHandle = await rootHandle.getDirectoryHandle(dir);
//     const fileHandle = await dirHandle.getFileHandle(name);
//     const resolved = await rootHandle.resolve(fileHandle);
//     t.deepEqual(resolved, [dir, name]);
//   }
// })

// test.serial('should return null when resolving file belonging to different directory using handle', async (t) => {
//   const rootHandle = await getRootHandle();
//   const dirHandle = await rootHandle.getDirectoryHandle('first');
//   const dirHandle2 = await rootHandle.getDirectoryHandle('quatre');
//   const fileHandle = await dirHandle.getFileHandle('points', {create: true});
//   const fileHandle2 = await dirHandle2.getFileHandle('points');
//   const resolved = await dirHandle2.resolve(fileHandle);
//   t.deepEqual(resolved, null);
//   const resolved2 = await dirHandle2.resolve(fileHandle2);
//   t.deepEqual(resolved2, ['quatre', 'points']);
//   const resolved3 = await dirHandle.resolve(fileHandle2);
//   t.deepEqual(resolved3, null);
//   const resolved4 = await dirHandle2.resolve({kind: fileHandle.kind, name: fileHandle.name} as any);
//   t.deepEqual(resolved4, ['quatre', 'points']);
//   await dirHandle.removeEntry('points');
// })

test.serial('should return file for file handle', async (t) => {
  const rootHandle = await getRootHandle();
  const fileHandle = await rootHandle.getFileHandle('annar');
  const file = await fileHandle.getFile();
  t.is(file.name, 'annar');
  //t.is(file.type, 'unknown'); // only using file extension to determine MIME type -- since there is no file extension, returned MIME type will be 'unknown'
  t.is(file.type, 'File');
  t.is(file.size, 123);
  t.true(file.lastModified >= 1658159058723);
})

// test.serial('should return file with correct MIME type for files with extension in name', async (t) => {
//   const rootHandle = await getRootHandle();
//   const files = [
//     {name: 'picture.this.png', type: 'image/png'},
//     {name: 'picture.that.jpg', type: 'image/jpeg'},
//     {name: 'picture.those.jpeg', type: 'image/jpeg'},
//     {name: 'binary.data.bin', type: 'application/octet-stream'},
//     {name: 'text.file.txt', type: 'text/plain'},
//   ];
//   for (const {name, type} of files) {
//     const fileHandle = await rootHandle.getFileHandle(name, {create: true});
//     const file = await fileHandle.getFile();
//     t.is(file.name, name);
//     t.is(file.type, type);
//     t.true(file.lastModified >= 1658159058723);
//     await rootHandle.removeEntry(fileHandle.name);
//   }
// })

test.serial('should return array buffer for file', async (t) => {
  const rootHandle = await getRootHandle();
  const fileHandle = await rootHandle.getFileHandle('annar');
  const file = await fileHandle.getFile();
  const buf = await file.arrayBuffer();
  t.is(buf.byteLength, 123);
  t.is(String.fromCharCode.apply(null, new Uint8Array(buf) as any), 'In order to make sure that this file is exactly 123 bytes in size, I have written this text while watching its chars count.');
})

test.serial('should return array buffer for blob', async (t) => {
  const rootHandle = await getRootHandle();
  const fileHandle = await rootHandle.getFileHandle('annar');
  const file = await fileHandle.getFile();
  const blob = file.slice();
  const buf = await blob.arrayBuffer();
  t.is(buf.byteLength, 123);
  t.is(String.fromCharCode.apply(null, new Uint8Array(buf) as any), 'In order to make sure that this file is exactly 123 bytes in size, I have written this text while watching its chars count.');
})

// test.serial('should return stream for file', async (t) => {
//   const rootHandle = await getRootHandle();
//   const fileHandle = await rootHandle.getFileHandle('annar');
//   const file = await fileHandle.getFile();
//   const stream = file.stream();
//   const reader = stream.getReader();
//   const x = await reader.read();
//   t.false(x.done);
//   t.is(x.value?.length, 123);
//   t.is(String.fromCharCode.apply(null, x.value?.valueOf() as any), 'In order to make sure that this file is exactly 123 bytes in size, I have written this text while watching its chars count.');
//   const y = await reader.read();
//   t.true(y.done);
// })

// test.serial('should return stream for blob', async (t) => {
//   const rootHandle = await getRootHandle();
//   const fileHandle = await rootHandle.getFileHandle('annar');
//   const file = await fileHandle.getFile();
//   const blob = file.slice();
//   const stream = blob.stream();
//   const reader = stream.getReader();
//   const x = await reader.read();
//   t.false(x.done);
//   t.is(x.value?.length, 123);
//   t.is(String.fromCharCode.apply(null, x.value?.valueOf() as any), 'In order to make sure that this file is exactly 123 bytes in size, I have written this text while watching its chars count.');
//   const y = await reader.read();
//   t.true(y.done);
// })

test.serial('should return text for file', async (t) => {
  const rootHandle = await getRootHandle();
  const fileHandle = await rootHandle.getFileHandle('annar');
  const file = await fileHandle.getFile();
  const text = await file.text();
  t.is(text, 'In order to make sure that this file is exactly 123 bytes in size, I have written this text while watching its chars count.');
})

test.serial('should return text for blob', async (t) => {
  const rootHandle = await getRootHandle();
  const fileHandle = await rootHandle.getFileHandle('annar');
  const file = await fileHandle.getFile();
  const blob = file.slice();
  const text = await blob.text();
  t.is(text, 'In order to make sure that this file is exactly 123 bytes in size, I have written this text while watching its chars count.');
})

test.serial('should return blob when slicing file', async (t) => {
  const rootHandle = await getRootHandle();
  const fileHandle = await rootHandle.getFileHandle('annar');
  const file = await fileHandle.getFile();
  const blob = file.slice();
  t.is(blob.size, file.size);
  //t.is(blob.type, '');
  const text = await blob.text();
  t.is(text, 'In order to make sure that this file is exactly 123 bytes in size, I have written this text while watching its chars count.');
  const blobby = file.slice(12, 65, 'text/plain');
  t.is(blobby.size, 53);
  t.is(blobby.type, 'text/plain');
  const texty = await blobby.text();
  t.is(texty, 'make sure that this file is exactly 123 bytes in size');
})

test.serial('should return blob when slicing blob', async (t) => {
  const rootHandle = await getRootHandle();
  const fileHandle = await rootHandle.getFileHandle('annar');
  const file = await fileHandle.getFile();
  const blob = file.slice(undefined, 500, 'text/plain');
  t.is(blob.size, file.size);
  //t.is(blob.type, 'text/plain');
  const text = await blob.text();
  t.is(text, 'In order to make sure that this file is exactly 123 bytes in size, I have written this text while watching its chars count.');
  const blobby = blob.slice(-200, -107, 'text/vanilla');
  t.is(blobby.size, 16);
  t.is(blobby.type, 'text/vanilla');
  const texty = await blobby.text();
  t.is(texty, 'In order to make');
})

test.serial('should return non-locked writable when creating writable and not keeping existing data', async (t) => {
  const rootHandle = await getRootHandle();
  const fileHandle = await rootHandle.getFileHandle('writable-overwrite', {create: true}) as FileSystemFileHandle;
  const writable = await fileHandle.createWritable();
  t.false(writable.locked);
  await rootHandle.removeEntry(fileHandle.name);
})

test.serial('should return non-locked writable when creating writable and keeping existing data', async (t) => {
  const rootHandle = await getRootHandle();
  const fileHandle = await rootHandle.getFileHandle('writable-append', {create: true}) as FileSystemFileHandle;
  const writable = await fileHandle.createWritable({keepExistingData: true});
  t.false(writable.locked);
  await rootHandle.removeEntry(fileHandle.name);
})

test.serial('should return error when writing unsupported type', async (t) => {
  const rootHandle = await getRootHandle();
  const fileHandle = await rootHandle.getFileHandle('writable-write-unsupported-type', {create: true}) as FileSystemFileHandle;
  const writable = await fileHandle.createWritable();
  const err = await t.throwsAsync(writable.write(69 as any));
  //t.is(err?.message, 'Writing unsupported type');
  t.is(err?.name, 'SyntaxError');
  await rootHandle.removeEntry(fileHandle.name);
})

test.serial('should succeed when writing blob', async (t) => {
  const rootHandle = await getRootHandle();
  const fileHandle = await rootHandle.getFileHandle('writable-write-blob', {create: true}) as FileSystemFileHandle;
  const writable = await fileHandle.createWritable();
  const blob = new Blob([JSON.stringify({hello: 'world'}, null, 2)], {type: 'application/json'});
  await t.notThrowsAsync(writable.write(blob));
  const file = await fileHandle.getFile();
  t.is(file.size, 22);
  const text = await file.text();
  t.is(text, '{\n  "hello": "world"\n}');
  await rootHandle.removeEntry(fileHandle.name);
})

test.serial('should succeed when writing typed array', async (t) => {
  const rootHandle = await getRootHandle();
  const fileHandle = await rootHandle.getFileHandle('writable-write-typed-array', {create: true}) as FileSystemFileHandle;
  const writable = await fileHandle.createWritable();
  const ta = new Int16Array([0,1,0,2,0,0,3,0,0,0,4,5]);
  await t.notThrowsAsync(writable.write(ta));
  const file = await fileHandle.getFile();
  const buf = await file.arrayBuffer();
  const tab = new Int16Array(buf);
  t.deepEqual(tab, ta);
  await rootHandle.removeEntry(fileHandle.name);
})

test.serial('should succeed when writing data view', async (t) => {
  const rootHandle = await getRootHandle();
  const fileHandle = await rootHandle.getFileHandle('writable-write-data-view', {create: true}) as FileSystemFileHandle;
  const writable = await fileHandle.createWritable();
  const dv = new DataView(new ArrayBuffer(16), 0);
  dv.setFloat64(0, 562949953421311.0);
  dv.setUint8(8, 254);
  dv.setInt32(9, 123456789, true);
  dv.setUint16(13, 54321);
  dv.setInt8(15, 127);
  await t.notThrowsAsync(writable.write(dv));
  const file = await fileHandle.getFile();
  const buf = await file.arrayBuffer();
  const dvb = new DataView(buf);
  t.deepEqual(dvb, dv);
  await rootHandle.removeEntry(fileHandle.name);
})

test.serial('should succeed when writing array buffer', async (t) => {
  const rootHandle = await getRootHandle();
  const fileHandle = await rootHandle.getFileHandle('writable-write-array-buffer', {create: true}) as FileSystemFileHandle;
  const writable = await fileHandle.createWritable();
  const ab = new ArrayBuffer(23);
  const dv = new DataView(ab, 0);
  dv.setFloat32(0, 1.175494351e-38, true);
  dv.setUint16(4, 54321, true);
  dv.setUint8(6, 7);
  dv.setFloat64(7, 562949953421311.0);
  dv.setUint8(15, 254);
  dv.setInt32(16, 123456789, true);
  dv.setUint16(20, 54321);
  dv.setInt8(22, 127);
  await t.notThrowsAsync(writable.write(ab));
  const file = await fileHandle.getFile();
  const buf = await file.arrayBuffer();
  t.deepEqual(buf, ab);
  await rootHandle.removeEntry(fileHandle.name);
})

test.serial('should return error when writing unsupported object type', async (t) => {
  const rootHandle = await getRootHandle();
  const fileHandle = await rootHandle.getFileHandle('writable-write-unsupported-object-type', {create: true}) as FileSystemFileHandle;
  const writable = await fileHandle.createWritable();
  const err = await t.throwsAsync(writable.write({} as any));
  //t.is(err?.message, 'Writing unsupported type');
  t.is(err?.name, 'SyntaxError');
  await rootHandle.removeEntry(fileHandle.name);
})

test.serial('should return error when writing unsupported object data type object', async (t) => {
  const rootHandle = await getRootHandle();
  const fileHandle = await rootHandle.getFileHandle('writable-write-unsupported-object-data-type-object', {create: true}) as FileSystemFileHandle;
  const writable = await fileHandle.createWritable();
  const err = await t.throwsAsync(writable.write({type: 'write', data: {} as any}));
  //t.is(err?.message, 'Writing unsupported data type');
  t.is(err?.name, 'SyntaxError');
  await rootHandle.removeEntry(fileHandle.name);
})

test.serial('should return error when writing unsupported object data type', async (t) => {
  const rootHandle = await getRootHandle();
  const fileHandle = await rootHandle.getFileHandle('writable-write-unsupported-object-data-type', {create: true}) as FileSystemFileHandle;
  const writable = await fileHandle.createWritable();
  const err = await t.throwsAsync(writable.write({type: 'write', data: 7 as any}));
  //t.is(err?.message, 'Writing unsupported data type');
  t.is(err?.name, 'SyntaxError');
  await rootHandle.removeEntry(fileHandle.name);
})

test.serial('should succeed when writing blob via struct', async (t) => {
  const rootHandle = await getRootHandle();
  const fileHandle = await rootHandle.getFileHandle('writable-write-blob-via-struct', {create: true}) as FileSystemFileHandle;
  const writable = await fileHandle.createWritable();
  const blob = new Blob([JSON.stringify({hello: 'world'}, null, 2)], {type: 'application/json'});
  await t.notThrowsAsync(writable.write({type: 'write', data: blob}));
  const file = await fileHandle.getFile();
  t.is(file.size, 22);
  const text = await file.text();
  t.is(text, '{\n  "hello": "world"\n}');
  await rootHandle.removeEntry(fileHandle.name);
})

test.serial('should succeed when writing typed array via struct', async (t) => {
  const rootHandle = await getRootHandle();
  const fileHandle = await rootHandle.getFileHandle('writable-write-typed-array-via-struct', {create: true}) as FileSystemFileHandle;
  const writable = await fileHandle.createWritable();
  const ta = new Int32Array([0,1,0,2,0,0,3]);
  await t.notThrowsAsync(writable.write({type: 'write', data: ta}));
  const file = await fileHandle.getFile();
  const buf = await file.arrayBuffer();
  const tab = new Int32Array(buf);
  t.deepEqual(tab, ta);
  await rootHandle.removeEntry(fileHandle.name);
})

test.serial('should succeed when writing data view via struct', async (t) => {
  const rootHandle = await getRootHandle();
  const fileHandle = await rootHandle.getFileHandle('writable-write-data-view-via-struct', {create: true}) as FileSystemFileHandle;
  const writable = await fileHandle.createWritable();
  const dv = new DataView(new ArrayBuffer(23), 0);
  dv.setFloat32(0, 1.175494351e-38, true);
  dv.setUint16(4, 54321, true);
  dv.setUint8(6, 7);
  dv.setFloat64(7, 562949953421311.0);
  dv.setUint8(15, 254);
  dv.setInt32(16, 123456789, true);
  dv.setUint16(20, 54321);
  dv.setInt8(22, 127);
  await t.notThrowsAsync(writable.write({type: 'write', data: dv}));
  const file = await fileHandle.getFile();
  const buf = await file.arrayBuffer();
  const dvb = new DataView(buf);
  t.deepEqual(dvb, dv);
  await rootHandle.removeEntry(fileHandle.name);
})

test.serial('should succeed when writing array buffer via struct', async (t) => {
  const rootHandle = await getRootHandle();
  const fileHandle = await rootHandle.getFileHandle('writable-write-array-buffer-via-struct', {create: true}) as FileSystemFileHandle;
  const writable = await fileHandle.createWritable();
  const ab = new ArrayBuffer(16);
  const dv = new DataView(ab, 0);
  dv.setFloat64(0, 562949953421311.0);
  dv.setUint8(8, 254);
  dv.setInt32(9, 123456789, true);
  dv.setUint16(13, 54321);
  dv.setInt8(15, 127);
  await t.notThrowsAsync(writable.write({type: 'write', data: ab}));
  const file = await fileHandle.getFile();
  const buf = await file.arrayBuffer();
  t.deepEqual(buf, ab);
  await rootHandle.removeEntry(fileHandle.name);
})


test.serial('should succeed when not keeping existing data and writing string', async (t) => {
  const rootHandle = await getRootHandle();
  const fileHandle = await rootHandle.getFileHandle('writable-write-string', {create: true}) as FileSystemFileHandle;
  const writable = await fileHandle.createWritable();
  await t.notThrowsAsync(writable.write('hello rust, all is well'));
  const overwritable = await fileHandle.createWritable();
  await t.notThrowsAsync(overwritable.write('happy days'));
  const file = await fileHandle.getFile();
  t.is(file.size, 23);
  const text = await file.text();
  t.is(text, 'happy days, all is well');
  await rootHandle.removeEntry(fileHandle.name);
})

test.serial('should succeed when not keeping existing data and writing string via struct', async (t) => {
  const rootHandle = await getRootHandle();
  const fileHandle = await rootHandle.getFileHandle('writable-write-string-via-struct', {create: true}) as FileSystemFileHandle;
  const writable = await fileHandle.createWritable();
  await t.notThrowsAsync(writable.write({type: 'write', data: 'hello rust, all is well'}));
  const overwritable = await fileHandle.createWritable();
  await t.notThrowsAsync(overwritable.write({type: 'write', data: 'happy days'}));
  const file = await fileHandle.getFile();
  t.is(file.size, 23);
  const text = await file.text();
  t.is(text, 'happy days, all is well');
  await rootHandle.removeEntry(fileHandle.name);
})


test.serial('should succeed when keeping existing data and writing string', async (t) => {
  const rootHandle = await getRootHandle();
  const fileHandle = await rootHandle.getFileHandle('writable-append-string', {create: true}) as FileSystemFileHandle;
  const writable = await fileHandle.createWritable();
  await t.notThrowsAsync(writable.write('salutations'));
  const appendable = await fileHandle.createWritable({keepExistingData: true});
  await t.notThrowsAsync(appendable.write(' from javascript'));
  const file = await fileHandle.getFile();
  t.is(file.size, 27);
  const text = await file.text();
  t.is(text, 'salutations from javascript');
  await rootHandle.removeEntry(fileHandle.name);
})

test.serial('should succeed when keeping existing data and writing string via struct', async (t) => {
  const rootHandle = await getRootHandle();
  const fileHandle = await rootHandle.getFileHandle('writable-append-string-via-struct', {create: true}) as FileSystemFileHandle;
  const writable = await fileHandle.createWritable();
  await t.notThrowsAsync(writable.write({type: 'write', data: 'salutations'}));
  const appendable = await fileHandle.createWritable({keepExistingData: true});
  await t.notThrowsAsync(appendable.write({type: 'write', data: ' from javascript'}));
  const file = await fileHandle.getFile();
  t.is(file.size, 27);
  const text = await file.text();
  t.is(text, 'salutations from javascript');
  await rootHandle.removeEntry(fileHandle.name);
})

test.serial('should succeed when writing string multiple times', async (t) => {
  const rootHandle = await getRootHandle();
  const fileHandle = await rootHandle.getFileHandle('writable-write-strings', {create: true}) as FileSystemFileHandle;
  const writable = await fileHandle.createWritable();
  await t.notThrowsAsync(writable.write('hello rust,'));
  await t.notThrowsAsync(writable.write(' how are you'));
  await t.notThrowsAsync(writable.write(' on this fine day?'));
  const file = await fileHandle.getFile();
  t.is(file.size, 41);
  const text = await file.text();
  t.is(text, 'hello rust, how are you on this fine day?');
  await rootHandle.removeEntry(fileHandle.name);
})

test.serial('should succeed when writing string multiple times via struct', async (t) => {
  const rootHandle = await getRootHandle();
  const fileHandle = await rootHandle.getFileHandle('writable-write-strings-via-struct', {create: true}) as FileSystemFileHandle;
  const writable = await fileHandle.createWritable();
  await t.notThrowsAsync(writable.write({type: 'write', data: 'hello rust,'}));
  await t.notThrowsAsync(writable.write({type: 'write', data: ' how are you'}));
  await t.notThrowsAsync(writable.write({type: 'write', data: ' on this fine day?'}));
  const file = await fileHandle.getFile();
  t.is(file.size, 41);
  const text = await file.text();
  t.is(text, 'hello rust, how are you on this fine day?');
  await rootHandle.removeEntry(fileHandle.name);
})

test.serial('should succeed when seeking past size of file', async (t) => {
  const rootHandle = await getRootHandle();
  const fileHandle = await rootHandle.getFileHandle('writable-seek-past-size', {create: true}) as FileSystemFileHandle;
  const writable = await fileHandle.createWritable();
  await writable.write('hello rust');
  await t.notThrowsAsync(writable.seek(600));
  await rootHandle.removeEntry(fileHandle.name);
})

test.serial('should succeed when seeking past size of file via write', async (t) => {
  const rootHandle = await getRootHandle();
  const fileHandle = await rootHandle.getFileHandle('writable-seek-past-size-via-write', {create: true}) as FileSystemFileHandle;
  const writable = await fileHandle.createWritable();
  await writable.write('hello rust');
  await t.notThrowsAsync(writable.write({type: 'seek', position: 600}));
  await rootHandle.removeEntry(fileHandle.name);
})

test.serial('should succeed when seeking position', async (t) => {
  const rootHandle = await getRootHandle();
  const fileHandle = await rootHandle.getFileHandle('writable-seek', {create: true}) as FileSystemFileHandle;
  const writable = await fileHandle.createWritable();
  await writable.write('hello rust');
  await t.notThrowsAsync(writable.seek(6));
  await rootHandle.removeEntry(fileHandle.name);
})

test.serial('should succeed when seeking position via write', async (t) => {
  const rootHandle = await getRootHandle();
  const fileHandle = await rootHandle.getFileHandle('writable-seek-via-write', {create: true}) as FileSystemFileHandle;
  const writable = await fileHandle.createWritable();
  await writable.write('hello rust');
  await t.notThrowsAsync(writable.write({type: 'seek', position: 6}));
  await rootHandle.removeEntry(fileHandle.name);
})

test.serial('should succeed when writing string after seek', async (t) => {
  const rootHandle = await getRootHandle();
  const fileHandle = await rootHandle.getFileHandle('writable-write-string-after-seek', {create: true}) as FileSystemFileHandle;
  const writable = await fileHandle.createWritable();
  await writable.write('hello rust');
  await t.notThrowsAsync(writable.seek(6));
  await writable.write('there');
  const file = await fileHandle.getFile();
  t.is(file.size, 11);
  const text = await file.text();
  t.is(text, 'hello there');
  await rootHandle.removeEntry(fileHandle.name);
})

test.serial('should succeed when writing string after seek via write', async (t) => {
  const rootHandle = await getRootHandle();
  const fileHandle = await rootHandle.getFileHandle('writable-write-string-after-seek-via-write', {create: true}) as FileSystemFileHandle;
  const writable = await fileHandle.createWritable();
  await writable.write('hello rust');
  await t.notThrowsAsync(writable.write({type: 'seek', position: 6}));
  await writable.write('there');
  const file = await fileHandle.getFile();
  t.is(file.size, 11);
  const text = await file.text();
  t.is(text, 'hello there');
  await rootHandle.removeEntry(fileHandle.name);
})

test.serial('should succeed when seeking past size of file and writing string via write', async (t) => {
  const rootHandle = await getRootHandle();
  const fileHandle = await rootHandle.getFileHandle('writable-seek-past-size-and-write-string-via-write', {create: true}) as FileSystemFileHandle;
  const writable = await fileHandle.createWritable();
  await writable.write('hello rust');
  await t.notThrowsAsync(writable.write({type: 'write', position: 13, data: 'tsur olleh'}));
  const file = await fileHandle.getFile();
  t.is(file.size, 23);
  const text = await file.text();
  t.is(text, 'hello rust\0\0\0tsur olleh');
  await rootHandle.removeEntry(fileHandle.name);
})

test.serial('should succeed when seeking and writing string via write', async (t) => {
  const rootHandle = await getRootHandle();
  const fileHandle = await rootHandle.getFileHandle('writable-seek-and-write-string-via-write', {create: true}) as FileSystemFileHandle;
  const writable = await fileHandle.createWritable();
  await writable.write('hello rust');
  await t.notThrowsAsync(writable.write({type: 'write', position: 6, data: 'there'}));
  const file = await fileHandle.getFile();
  t.is(file.size, 11);
  const text = await file.text();
  t.is(text, 'hello there');
  await rootHandle.removeEntry(fileHandle.name);
})

test.serial('should succeed when seeking and writing string object via write', async (t) => {
  const rootHandle = await getRootHandle();
  const fileHandle = await rootHandle.getFileHandle('writable-seek-and-write-string-object-via-write', {create: true}) as FileSystemFileHandle;
  const writable = await fileHandle.createWritable();
  await writable.write('hello rust');
  await t.notThrowsAsync(writable.write({type: 'write', position: 6, data: 'world'}));
  const file = await fileHandle.getFile();
  t.is(file.size, 11);
  const text = await file.text();
  t.is(text, 'hello world');
  await rootHandle.removeEntry(fileHandle.name);
})

test.serial('should succeed when truncating size', async (t) => {
  const rootHandle = await getRootHandle();
  const fileHandle = await rootHandle.getFileHandle('writable-truncate', {create: true}) as FileSystemFileHandle;
  const writable = await fileHandle.createWritable();
  await writable.write('hello rust');
  await t.notThrowsAsync(writable.truncate(5));
  const file = await fileHandle.getFile();
  t.is(file.size, 5);
  const text = await file.text();
  t.is(text, 'hello');
  await rootHandle.removeEntry(fileHandle.name);
})

test.serial('should succeed when truncating beyond current size', async (t) => {
  const rootHandle = await getRootHandle();
  const fileHandle = await rootHandle.getFileHandle('writable-truncate', {create: true}) as FileSystemFileHandle;
  const writable = await fileHandle.createWritable();
  await writable.write('hello rust');
  await t.notThrowsAsync(writable.truncate(15));
  const file = await fileHandle.getFile();
  t.is(file.size, 15);
  const buf = await file.arrayBuffer();
  t.is(buf.byteLength, 15);
  t.is(String.fromCharCode.apply(null, new Uint8Array(buf) as any), 'hello rust\0\0\0\0\0');
  await rootHandle.removeEntry(fileHandle.name);
})

test.serial('should succeed when truncating size via write', async (t) => {
  const rootHandle = await getRootHandle();
  const fileHandle = await rootHandle.getFileHandle('writable-truncate-via-write', {create: true}) as FileSystemFileHandle;
  const writable = await fileHandle.createWritable();
  await writable.write('hello rust');
  await t.notThrowsAsync(writable.write({type: 'truncate', size: 5}));
  const file = await fileHandle.getFile();
  t.is(file.size, 5);
  const text = await file.text();
  t.is(text, 'hello');
  await rootHandle.removeEntry(fileHandle.name);
})

test.serial('should succeed when truncating beyond current size via write', async (t) => {
  const rootHandle = await getRootHandle();
  const fileHandle = await rootHandle.getFileHandle('writable-truncate-via-write', {create: true}) as FileSystemFileHandle;
  const writable = await fileHandle.createWritable();
  await writable.write('hello rust');
  await t.notThrowsAsync(writable.write({type: 'truncate', size: 15}));
  const file = await fileHandle.getFile();
  t.is(file.size, 15);
  const buf = await file.arrayBuffer();
  t.is(buf.byteLength, 15);
  t.is(String.fromCharCode.apply(null, new Uint8Array(buf) as any), 'hello rust\0\0\0\0\0');
  await rootHandle.removeEntry(fileHandle.name);
})

test.serial('should succeed when writing string after truncating size', async (t) => {
  const rootHandle = await getRootHandle();
  const fileHandle = await rootHandle.getFileHandle('writable-write-string-after-truncate', {create: true}) as FileSystemFileHandle;
  const writable = await fileHandle.createWritable();
  await writable.write('hello rust');
  await t.notThrowsAsync(writable.truncate(4));
  await writable.write('bound troublemaker');
  const file = await fileHandle.getFile();
  t.is(file.size, 22);
  const text = await file.text();
  t.is(text, 'hellbound troublemaker');
  await rootHandle.removeEntry(fileHandle.name);
})

test.serial('should succeed when writing string after truncating beyond current size', async (t) => {
  const rootHandle = await getRootHandle();
  const fileHandle = await rootHandle.getFileHandle('writable-write-string-after-truncate', {create: true}) as FileSystemFileHandle;
  const writable = await fileHandle.createWritable();
  await writable.write('hello rust');
  await t.notThrowsAsync(writable.truncate(11));
  const file = await fileHandle.getFile();
  t.is(file.size, 11);
  const buf = await file.arrayBuffer();
  t.is(buf.byteLength, 11);
  t.is(String.fromCharCode.apply(null, new Uint8Array(buf) as any), 'hello rust\0');
  await writable.write('tsur olleh');
  const file2 = await fileHandle.getFile();
  t.is(file2.size, 21);
  const buf2 = await file2.arrayBuffer();
  t.is(buf2.byteLength, 21);
  t.is(String.fromCharCode.apply(null, new Uint8Array(buf2) as any), 'hello rust\0tsur olleh');
  await rootHandle.removeEntry(fileHandle.name);
})

test.serial('should succeed when writing string after truncating size via write', async (t) => {
  const rootHandle = await getRootHandle();
  const fileHandle = await rootHandle.getFileHandle('writable-write-string-after-truncate-via-write', {create: true}) as FileSystemFileHandle;
  const writable = await fileHandle.createWritable();
  await writable.write('hello rust');
  await t.notThrowsAsync(writable.write({type: 'truncate', size: 4}));
  await writable.write('bound troublemaker');
  const file = await fileHandle.getFile();
  t.is(file.size, 22);
  const text = await file.text();
  t.is(text, 'hellbound troublemaker');
  await rootHandle.removeEntry(fileHandle.name);
})

test.serial('should succeed when writing string after truncating beyond current size via write', async (t) => {
  const rootHandle = await getRootHandle();
  const fileHandle = await rootHandle.getFileHandle('writable-write-string-after-truncate-via-write', {create: true}) as FileSystemFileHandle;
  const writable = await fileHandle.createWritable();
  await writable.write('hello rust');
  await t.notThrowsAsync(writable.write({type: 'truncate', size: 13}));
  await writable.write('tsur olleh');
  const file = await fileHandle.getFile();
  t.is(file.size, 23);
  const buf = await file.arrayBuffer();
  t.is(buf.byteLength, 23);
  t.is(String.fromCharCode.apply(null, new Uint8Array(buf) as any), 'hello rust\0\0\0tsur olleh');
  await rootHandle.removeEntry(fileHandle.name);
})

test.serial('should succeed when closing writable file stream', async (t) => {
  const rootHandle = await getRootHandle();
  const fileHandle = await rootHandle.getFileHandle('writable-close', {create: true}) as FileSystemFileHandle;
  const writable = await fileHandle.createWritable();
  await t.notThrowsAsync(writable.close());
  await rootHandle.removeEntry(fileHandle.name);
})

test.serial('should succeed when aborting writable file stream', async (t) => {
  const rootHandle = await getRootHandle();
  const fileHandle = await rootHandle.getFileHandle('writable-abort', {create: true}) as FileSystemFileHandle;
  const writable = await fileHandle.createWritable();
  await t.notThrowsAsync(writable.abort('I got my reasons'));
  await rootHandle.removeEntry(fileHandle.name);
})

test.serial('should return writer for writable file stream', async (t) => {
  const rootHandle = await getRootHandle();
  const fileHandle = await rootHandle.getFileHandle('writable-writer', {create: true}) as FileSystemFileHandle;
  const writable = await fileHandle.createWritable();
  t.false(writable.locked);
  const writer = writable.getWriter();
  await new Promise(r => setTimeout(r, 10)); // XXX: writable.locked is set by write stream sink's start method which gets invoked asynchronously
  t.true(writable.locked);
  t.is(writer.desiredSize, 1);
  await t.notThrowsAsync(writer.ready.then(() => writer.write('written using writable writer')));
  await t.notThrowsAsync(writer.close());
  await t.notThrowsAsync(writer.abort('I got my reasons'));
  writer.releaseLock();
  t.false(writable.locked);
  const file = await fileHandle.getFile();
  t.is(file.size, 29);
  const text = await file.text();
  t.is(text, 'written using writable writer');
  await rootHandle.removeEntry(fileHandle.name);
})

test.serial('should return error when getting writer for locked writable file stream', async (t) => {
  const rootHandle = await getRootHandle();
  const fileHandle = await rootHandle.getFileHandle('writable-writer-locked', {create: true}) as FileSystemFileHandle;
  const writable = await fileHandle.createWritable();
  t.false(writable.locked);
  const writer = writable.getWriter();
  await new Promise(r => setTimeout(r, 10)); // XXX: writable.locked is set by write stream sink's start method which gets invoked asynchronously
  t.true(writable.locked);
  t.is(writer.desiredSize, 1);
  const err = t.throws((() => writable.getWriter()));
  t.is(err?.message, 'Invalid state: WritableStream is locked');
  await t.notThrowsAsync(writer.abort('I got my reasons'));
  const err2 = await t.throwsAsync(writer.close());
  t.is(err2?.message, 'Invalid state: WritableStream is closed');
  writer.releaseLock();
  t.false(writable.locked);
  await rootHandle.removeEntry(fileHandle.name);
})

test.serial('should handle getting directories concurrently', async (t) => {
  // @ts-ignore
  const count = process.env.TEST_USING_MOCKS ? 1000 : 10;
  const rootHandle = await getRootHandle();
  for (let i = 0; i < count; i++) {
    const [first, quatre] = await Promise.all([
      rootHandle.getDirectoryHandle('first'),
      rootHandle.getDirectoryHandle('quatre'),
    ]);
    t.is(first.kind, 'directory');
    t.is(first.name, 'first');
    t.is(quatre.kind, 'directory');
    t.is(quatre.name, 'quatre');
  }
})

// test.serial('should handle requesting permissions concurrently', async (t) => {
//   // @ts-ignore
//   const count = process.env.TEST_USING_MOCKS ? 1000 : 10;
//   const rootHandle = await getRootHandle();
//   const [first, quatre] = await Promise.all([
//     rootHandle.getDirectoryHandle('first') as Promise<FileSystemDirectoryHandle>,
//     rootHandle.getDirectoryHandle('quatre') as Promise<FileSystemDirectoryHandle>,
//   ]);
//   for (let i = 0; i < count; i++) {
//     const [firstPerm, quatrePerm] = await Promise.all([
//       first.queryPermission({mode: 'readwrite'}),
//       quatre.queryPermission({mode: 'readwrite'}),
//     ]);
//     t.is(firstPerm, 'granted');
//     t.is(quatrePerm, 'denied');
//   }
// })

// test.serial('should handle resolving concurrently', async (t) => {
//   // @ts-ignore
//   const count = process.env.TEST_USING_MOCKS ? 1000 : 10;
//   const rootHandle = await getRootHandle();
//   for (let i = 0; i < count; i++) {
//     const [first, quatre] = await Promise.all([
//       rootHandle.resolve({kind: 'directory', name: 'first'} as any),
//       rootHandle.resolve({kind: 'directory', name: 'quatre'} as any),
//     ]);
//     t.deepEqual(first, ['first']);
//     t.deepEqual(quatre, ['quatre']);
//   }
// })
