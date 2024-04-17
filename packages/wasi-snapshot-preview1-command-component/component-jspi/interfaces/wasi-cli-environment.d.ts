export namespace WasiCliEnvironment {
  export function  getEnvironment(): Promise<[string, string][]>;
  export function  getArguments(): Promise<string[]>;
}
