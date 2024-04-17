export interface WasiExtCliTerminalOutputExtended {
}
export interface RowsAndColumns {
  rows: number,
  columns: number,
}

export interface TerminalOutputExtended extends Disposable {
  windowSize(): RowsAndColumns;
}
