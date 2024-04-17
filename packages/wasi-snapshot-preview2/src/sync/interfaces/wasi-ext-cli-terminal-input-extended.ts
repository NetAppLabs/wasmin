export interface WasiExtCliTerminalInputExtended {
}

export interface TerminalInputExtended extends Disposable {
  getRawMode(): boolean;
  setRawMode(rawMode: boolean): void;
}
