export interface WasiExtCliTerminalInputExtended {
}

export interface TerminalInputExtended extends AsyncDisposable {
  getRawMode(): Promise<boolean>;
  setRawMode(rawMode: boolean): Promise<void>;
}
