import { MyBlob } from "./blob";

export class MyFile extends MyBlob {
  constructor(
    fileBits: any[],
    fileName: string,
    options: {
      lastModified?: number | string | Date | boolean;
      type?: string;
    } = {}
  ) {
    super(fileBits, options);

    if (arguments.length < 2) {
      throw new TypeError(
        `Failed to construct 'File': 2 arguments required, but only ${arguments.length} present.`
      );
    }

    if (options === null) options = {};

    const modified = Number(options.lastModified);
    this.lastModified = Number.isNaN(modified) ? Date.now() : modified;
    this.name = String(fileName);
  }

  public lastModified = 0;
  public name = "";

  get [Symbol.toStringTag]() {
    return "File";
  }
}
