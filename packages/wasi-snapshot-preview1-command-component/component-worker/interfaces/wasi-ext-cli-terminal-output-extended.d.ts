export namespace WasiExtCliTerminalOutputExtended {
  export { TerminalOutputExtended };
}
export interface RowsAndColumns {
  rows: number,
  columns: number,
}

export class TerminalOutputExtended {
  windowSize(): RowsAndColumns;
}
