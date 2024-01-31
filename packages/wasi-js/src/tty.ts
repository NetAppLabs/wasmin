const TTY_DEBUG = false;

function ttyDebug(msg?: any, ...optionalParams: any[]): void {
    if (TTY_DEBUG) {
        console.debug(msg, ...optionalParams);
    }
}

export interface TTYSize {
    columns: number,
    rows: number,
}

export type TTYOnResizeFunc = (size: TTYSize) => Promise<void>;
export interface TTY {
    setRawMode(rawMode: boolean): Promise<void>;
    getRawMode(): Promise<boolean>;
    getSize(): Promise<TTYSize>;
    setSize(size: TTYSize): Promise<void>;
    setOnResize(onResizeFunc: TTYOnResizeFunc): Promise<void>;
}

export class TTYImplementation implements TTY {
    constructor(columns: number, rows: number, rawMode: boolean, modeListener?: (rawMode: boolean) => void) {
        this._columns = columns;
        this._rows = rows;
        this._rawMode = rawMode;
        this._modeListener = modeListener;
        this.setSize = this.setSizeImpl.bind(this);
        this.getSize = this.getSizeImpl.bind(this);
        this.getRawMode = this.getRawModeImpl.bind(this);
        this.setRawMode = this.setRawModeImpl.bind(this);
        this.setOnResize = this.setOnResizeImpl.bind(this);
    }
    async setRawModeImpl(rawMode: boolean): Promise<void> {
        this.rawMode = rawMode;
    }
    async getRawModeImpl(): Promise<boolean> {
        return this.rawMode;
    }
    async getSizeImpl(): Promise<TTYSize> {
        let size: TTYSize = {
            columns: this._columns,
            rows: this._rows,
        }
        return size;
    }
    async setSizeImpl(size: TTYSize): Promise<void> {
        this._rows = size.rows;
        this._columns = size.columns;
        if (this._onResize) {
            await this._onResize(size);
        }
    }
    async setOnResizeImpl(onResizeFunc: TTYOnResizeFunc): Promise<void> {
        this._onResize = onResizeFunc;
    }
    _columns: number;
    _rows: number;
    _rawMode: boolean;
    _modeListener?: (rawMode: boolean) => void;
    setSize: (size: TTYSize) => Promise<void>;
    getSize: () => Promise<TTYSize>;
    getRawMode: () => Promise<boolean>;
    setRawMode: (rawMode: boolean) => Promise<void>;
    _onResize?: TTYOnResizeFunc;
    setOnResize: (resizeFunc: TTYOnResizeFunc) => Promise<void>;

    set rawMode(rawMode: boolean) {
        ttyDebug("set rawMode: ", rawMode);
        if (this._modeListener) {
            this._modeListener(rawMode);
        }
        this._rawMode = rawMode;
    }
    get rawMode() {
        return this._rawMode;
    }
}
