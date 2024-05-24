export namespace WasiCliEnvironment {
  export function getEnvironment(): [string, string][];
  export function getArguments(): string[];
  export function initialCwd(): string | undefined;
}
