export class TextDecoderWrapper implements TextDecoder {
    constructor(label?: string | undefined, options?: TextDecoderOptions | undefined) {
        let encoding = label;
        if (!encoding) {
            encoding = "utf8";
        }
        this.encoding = encoding;
        this.fatal = false;
        this.ignoreBOM = true;
        this.innerDecoder = new TextDecoder(this.encoding, options);
    }
    encoding: string;
    fatal: boolean;
    ignoreBOM: boolean;
    innerDecoder: TextDecoder;

    decode(input?: BufferSource, options?: TextDecodeOptions): string {
        if (input instanceof Uint8Array) {
            const uArr = input as Uint8Array;
            return this.decodeUint8Array(uArr, options);
        } else {
            return this.innerDecoder.decode(input, options);
        }
    }

    decodeUint8Array(input?: Uint8Array, options?: TextDecodeOptions): string {
        if (input) {
            if (input.buffer instanceof SharedArrayBuffer) {
                const newData = new Uint8Array(input);
                return this.innerDecoder.decode(newData, options);
            } else {
                return this.innerDecoder.decode(input, options);
            }
        }
        return "";
    }
}
