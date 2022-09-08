const TTY_DEBUG = false;

function ttyDebug(msg?: any, ...optionalParams: any[]): void {
    if (TTY_DEBUG) {
        console.debug(msg, optionalParams);
    }
}
export class TTY {
    constructor(columns: number, rows: number, rawMode: boolean, modeListener?: (rawMode: boolean) => void) {
        this.columns = columns;
        this.rows = rows;
        this._rawMode = rawMode;
        this._modeListener = modeListener;
    }
    columns: number;
    rows: number;
    _rawMode: boolean;
    _modeListener?: (rawMode: boolean) => void;
    moduleInstanceExports: WebAssembly.Exports | undefined;
    set rawMode(rawMode: boolean) {
        if (this._modeListener) {
            this._modeListener(rawMode);
        }
        this._rawMode = rawMode;
    }

    get rawMode() {
        return this._rawMode;
    }
    public setModuleInstanceExports(modInst: WebAssembly.Exports) {
        this.moduleInstanceExports = modInst;
    }
    public async setColumns(columns: number) {
        this.columns = columns;
        if (this.moduleInstanceExports) {
            ttyDebug("setColumns moduleInstance:", this.moduleInstanceExports);
            // @ts-ignore
            const { term_set_columns } = this.moduleInstanceExports;
            if (term_set_columns) {
                ttyDebug("term_set_columns", columns);
                // @ts-ignore
                await term_set_columns(columns);
            } else {
                ttyDebug("term_set_columns does not exist");
            }
        } else {
            ttyDebug("setColumns moduleInstance is null");
        }
    }
    public async setRows(rows: number) {
        this.rows = rows;
        if (this.moduleInstanceExports) {
            // @ts-ignore
            const { term_set_rows } = this.moduleInstanceExports;
            if (term_set_rows) {
                ttyDebug("term_set_rows", rows);
                await (term_set_rows as any)(rows);
            }
        }
    }
    public async reload() {
        if (this.moduleInstanceExports) {
            // @ts-ignore
            const { term_reload } = this.moduleInstanceExports;
            if (term_reload) {
                ttyDebug("term_reload", term_reload);
                await (term_reload as any)();
            }
        }
    }
}
