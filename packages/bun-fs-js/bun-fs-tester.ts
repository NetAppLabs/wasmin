

// test slice on bun
const path = "testfolder/awesome.txt";
const sliceStart = 2;
const end = 15;

const f = Bun.file(path);
const sl = f.slice(sliceStart, end);

const contents = await sl.text();
console.log("sl: ", contents);
