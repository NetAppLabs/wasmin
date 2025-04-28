/**
 * Copyright 2025 NetApp Inc. All Rights Reserved.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 *
 * SPDX-License-Identifier: Apache-2.0
 */

import { trpc } from "./utils/trpc.js";
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
