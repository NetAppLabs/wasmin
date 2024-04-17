export interface WasiCliRun {
  /**
   * Run the program.
   */
   run(): Promise<void>;
}
