export interface CliBaseEnvironment {
    /**
     * Get the POSIX-style environment variables.
     *
     * Each environment variable is provided as a pair of string variable names
     * and string value.
     *
     * Morally, these are a value import, but until value imports are available
     * in the component model, this import function should return the same
     * values each time it is called.
     */
    getEnvironment(): [string, string][];
    /**
     * Get the POSIX-style arguments to the program.
     */
    getArguments(): string[];
}
export interface CliBaseEnvironmentAsync {
    /**
     * Get the POSIX-style environment variables.
     *
     * Each environment variable is provided as a pair of string variable names
     * and string value.
     *
     * Morally, these are a value import, but until value imports are available
     * in the component model, this import function should return the same
     * values each time it is called.
     */
    getEnvironment(): Promise<[string, string][]>;
    /**
     * Get the POSIX-style arguments to the program.
     */
    getArguments(): Promise<string[]>;
}
//# sourceMappingURL=cli-base-environment.d.ts.map