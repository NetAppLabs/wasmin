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

import { debugMessage, WasmLoader } from "./generic.js";
import { ManifestOCI, ManifestOCIDescriptor, ManifestOCIIndex, ManifestV2, ManifestV2List, RegistryClientV2, RegistryIndex, RegistryRepo } from '@makeshifter/oci-registry-client';
import { extract, ReadEntry } from 'tar'

import {
    fetchBlob,
    getAuthFromConfigFile,
    getImageReferenceParameters,
    getManifest,
    fetchLayer,
} from "oci-client";


export class OciLoader implements WasmLoader {


    async instantiate(relPath: string): Promise<Uint8Array> {

        const relPathSplits = relPath.split("/");

        const lastPart = relPathSplits[relPathSplits.length - 1];
        let imageName = relPath.replace(`/${lastPart}`, "");
        // cut off leading /
        imageName = imageName.substring(1);
        // replace // to : for port 
        // TODO find better way to do this
        imageName = imageName.replace('//', ":");
        debugMessage("OciLoader imageName is : ", imageName);

        const imageTag = lastPart;
        debugMessage("OciLoader imageTag is : ", imageTag);

        let arr = await this.instantiateWithRegistryClient(imageName, imageTag);
        return arr;
    }

    async instantiateWithOciClient(imageName: string,imageTag: string): Promise<Uint8Array> {
        const username = "";
        const password = "";

        /*
        const authentication = {
            username: username,
            password: password,
        };
        */
        const authentication = undefined;
        const ociUrl = `oci://${imageName}:${imageTag}`;
        debugMessage("instantiateWithOciClient: ociUrl: ", ociUrl);
        /*
        const blob = await fetchBlob(
            ociUrl,
            undefined, // Get the first available layer
            {
                authentication: authentication,
            },
        );
        const arrBuffer = await blob.arrayBuffer();
        const uarr = new Uint8Array(arrBuffer);
        return uarr;*/
        //const { registry, repository, reference } = getImageReferenceParameters(ociUrl);

        const ociRef = getImageReferenceParameters(ociUrl);
        const manifest = await getManifest(ociRef);
        const registry = ociRef.registry;
        const repository = ociRef.repository;
        // Fetch a specific layer (e.g., the first one)
        const layer = await fetchLayer(registry, repository, manifest.layers[0]);
        const content = await layer.arrayBuffer();
        const uarr = new Uint8Array(content);
        return uarr;
    }

    async instantiateWithRegistryClient(imageName: string, imageTag: string): Promise<Uint8Array> {

        // Dockerhub: normal user/password
        // Github: username $USERNAME password $GITHUB_TOKEN
        // like with Github API, username can probably be anything (haven't confirmed)
        // AWS ECR: username "AWS" password from running aws ecr get-login-password
        // you need AWS auth even for 'public' images
        // Gcloud GCR: username "oauth2accesstoken" password from running gcloud auth print-access-token

        const username = "";
        const password = "";

        /*
        const registryIndex: RegistryIndex = {
            name: "localhost:5005",
            official: false,
            scheme: "http"
        };
        const repository: RegistryRepo = {
            index: registryIndex,
            official: false,
            remoteName: "localhost:5005/rancher/mirrored-pause",
            localName: "localhost:5005/rancher/mirrored-pause",
            canonicalName: "localhost:5005/rancher/mirrored-pause"
        }
        */

        const registryClient = new RegistryClientV2({
            //repo: repository,
            name: imageName,
            // Optional basic auth to the registry
            username: username,
            password: password,
            acceptOCIManifests: true,
            acceptManifestLists: true,
            // Optional, for a registry without a signed TLS certificate.
            // NOTE: Deno does not currently support this option
            //insecure: true,
            // ... see the source code for other options
        });
        const supportsV2 = await registryClient.supportsV2();
        debugMessage("OciLoader SupportsV2: ", supportsV2);

        const tags = await registryClient.listTags();
        debugMessage("OciLoader Tags", JSON.stringify(tags, null, 4));

        const tagManifest = tags.manifest;
        debugMessage(JSON.stringify(tagManifest, null, 4));
        const manifestRef = imageTag;
        const manifestRequest = {
            ref: manifestRef,
            acceptManifestLists: true,
            acceptOCIManifests: true,
            followRedirects: true,
        };
        const manifestResponse = await registryClient.getManifest(manifestRequest);
        let manifest = manifestResponse.manifest;
        const manifestMediaType = manifest.mediaType;
        debugMessage("OciLoader manifestMediaType: ", manifestMediaType);

        if (manifestMediaType == "application/vnd.docker.distribution.manifest.v2+json") {
            const dockerManifest = manifest as ManifestV2;
            debugMessage("OciLoader manifest is docker distribution manifest");
        } else if (manifestMediaType == "application/vnd.docker.distribution.manifest.list.v2+json") {
            const dockerManifestList = manifest as ManifestV2List;
            debugMessage("OciLoader manifest is docker distribution manifest list");
        } else if (manifestMediaType == "application/vnd.oci.image.manifest.v1+json") {
            const ociManifest = manifest as ManifestOCI;
            debugMessage("OciLoader manifest is oci image manifest");
        } else if (manifestMediaType == "application/vnd.oci.image.index.v1+json") {
            const ociIndex = manifest as ManifestOCIIndex;
            debugMessage("OciLoader manifest is oci image index");
        }
        manifest = manifest as ManifestV2;
        debugMessage(JSON.stringify(manifest, null, 4));

        // head
        //let manarr = await fetchOciLayer(registryClient, manifest.config);
        // layers
        let larr = await fetchOciFirstLayer(registryClient, manifest.layers);

        //throw new Error('not implemented');
        return larr;
    }
}

/*
async function fetchOciLayers(client: RegistryClientV2, ociman: ManifestOCIDescriptor[]): Promise<Uint8Array> {
    let uarr = new Uint8Array();
    for (const ociLayer of ociman) {
        const layerArr = await fetchOciLayer(client, ociLayer);
        uarr = layerArr as Uint8Array<ArrayBuffer>;
    }
    return uarr;
}
*/

async function fetchOciFirstLayer(client: RegistryClientV2, ociman: ManifestOCIDescriptor[]): Promise<Uint8Array> {
    if (ociman.length > 0) {
        const ociLayer = ociman[0];
        const layerArr = await fetchOciLayer(client, ociLayer);
        return layerArr;
    }
    throw new Error("OCI Manifest does not contain layer");
}


async function fetchOciLayer(client: RegistryClientV2, ociman: ManifestOCIDescriptor): Promise<Uint8Array> {
    let prom: Promise<Uint8Array> = new Promise(async (resolve,reject) => {
        let uarr = new Uint8Array();
        const mediaType = ociman.mediaType;
        const manifestSize = ociman.size;
        let unTar = false;
        debugMessage("OciLoader fetchOciLayer mediaType: ", mediaType);
        debugMessage("OciLoader fetchOciLayer manifestSize: ", manifestSize);

        if (mediaType == "application/vnd.oci.image.layer.v1.tar") {
            unTar = true;
        }
        const digestWithHashToDownload = ociman.digest;
        const digestToDownload = digestWithHashToDownload;
        const blobToDownloadResponse = await client.createBlobReadStream({ digest: digestToDownload });

        const blobResponses = blobToDownloadResponse.ress;
        debugMessage("OciLoader fetchOciLayer blobResponses length ", blobResponses.length);

        // take the last blob response because of redirects
        const contentBlob = blobResponses[blobResponses.length-1];

        debugMessage("OciLoader fetchOciLayer downloading digest ", digestToDownload);
        debugMessage("OciLoader fetchOciLayer downloading unTar ", unTar);
        if (unTar) {
            const inputStream = contentBlob.dockerStream();
            // const filePath = "";
            // extract({
            //     f: filePath,
            // })
            inputStream.pipe(
                extract()
            )
            .on('entry', async entry => { 
                const readEntry = entry as ReadEntry;
                const concatAll = await readEntry.concat();
                //const collectedFirst = collectedAll[0];
                //debugMessage("untar got collected:", collected);
                //const returnArr1 = collected as any as Buffer;
                //const returnArr2 = returnArr1;
                const returnArr = new Uint8Array(concatAll);
                debugMessage("OciLoader fetchOciLayer got returnArr:", returnArr);
                resolve(returnArr);
                })
        } else {
            const blobBody = await contentBlob.dockerBody();
            debugMessage("OciLoader fetchOciLayer blobBody", blobBody);
            uarr = blobBody as Uint8Array<ArrayBuffer>;
            resolve(uarr);
        }
    });
    return prom;
}