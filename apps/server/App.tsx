import { trpc } from "./utils/trpc";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useState } from "react";
import { httpBatchLink } from "@trpc/client";

export const App = () => {
    const [queryClient] = useState(() => new QueryClient());
    const [trpcClient] = useState(() =>
        trpc.createClient({
            links: [
                httpBatchLink({
                    url: "http://localhost:5000",
                }),
            ],
        })
    );

    return (
        <trpc.Provider client={trpcClient} queryClient={queryClient}>
            <QueryClientProvider client={queryClient}>
                <Component />
            </QueryClientProvider>
        </trpc.Provider>
    );
};

export const Component = () => {
    //const processes = trpc.process.list.useQuery();
    const hosts = trpc.host.list.useQuery();

    return (
        <div>
            <h1>Hosts</h1>
            {hosts.data ? (
                <ul>
                    {hosts.data.map((host) => (
                        <li>
                            {host.name} [{host.id}]
                        </li>
                    ))}
                </ul>
            ) : (
                <div>Loading...</div>
            )}
        </div>
    );
};
