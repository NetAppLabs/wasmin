
import { z } from "zod";

export const Host = z.object({
    id: z.string(),
    name: z.string(),
    ipv4: z.string(),
    ipv6: z.string(),
    port: z.optional(z.number()),
    arch: z.string(),
    os: z.string(),
    runtime: z.string(),
});

// extract the inferred type
export type Host = z.infer<typeof Host>;

export const HostList = z.array(
    Host
);

export const HostMap = z.record(
    z.string(),
    Host
);

export const ProcessStatuses = ["created", "ready", "running", "waiting", "terminated"] as const;

export const Process = z.object({
    id: z.optional(z.string()),
    cmd: z.string(),
    status: z.optional(z.enum(ProcessStatuses)),
    parent: z.optional(z.string()),
    env: z.optional(z.record(z.string(), z.string())),
    args: z.optional(z.array(z.string())),
    stdin: z.optional(z.string()),
    stdout: z.optional(z.string()),
    stderr: z.optional(z.string()),
    mounts: z.optional(z.record(z.string(), z.string())),
    features: z.optional(z.record(z.string(), z.boolean())),
    startTime : z.optional(z.date()),
    endTime : z.optional(z.date()),
    exitCode: z.optional(z.number()),
});

export const ProcessList = z.array(
    Process
);

export const ProcessMap = z.record(
    z.string(),
    Process
);

// extract the inferred type
export type Process = z.infer<typeof Process>;