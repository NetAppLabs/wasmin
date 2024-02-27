export interface WasiExtCliTerminalOutputExtended {
}
export interface TerminalSize {
  columns: number,
  rows: number,
}

export interface TerminalOutputExtended extends AsyncDisposable {
  getSize(): Promise<TerminalSize>;
}
