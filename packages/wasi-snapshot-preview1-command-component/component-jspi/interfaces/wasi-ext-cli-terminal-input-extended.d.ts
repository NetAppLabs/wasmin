export namespace WasiExtCliTerminalInputExtended {
  export { TerminalInputExtended };
}

export class TerminalInputExtended {
  getRawMode(): Promise<boolean>;
  setRawMode(rawMode: boolean): Promise<void>;
}
