# wasmin

`Wasmin` a contains a collection of packages and building blocks for running [WASI](https://wasi.dev) [WebAssembly](https://webassembly.org) applications on top of JavaScript Runtimes.

Main package implementing the [WASI](https://wasi.dev) layer is `@netapplabs/wasi-js` with support for [Preview 1](https://github.com/WebAssembly/WASI/blob/main/legacy/preview1/docs.md) and experimental support for [Preview 2](https://github.com/WebAssembly/WASI/blob/main/wasip2/README.md) and component mode.

## About

This repo is structured as a monorepo using [Yarn](https://classic.yarnpkg.com/lang/en/) and [turborepo](https://turborepo.org).

Each package/app written in [TypeScript](https://www.typescriptlang.org/).
It includes the following packages and apps:

### Packages

-   `@netapplabs/fs-js`: Virtual FileSystem layer based on [WHATWG File System Standard](https://fs.spec.whatwg.org/)
-   `@netapplabs/node-fs-js`:  Implementation of [File System Standard](https://fs.spec.whatwg.org/) on top of [Node File system](https://nodejs.org/api/fs.html)
-   `@netapplabs/bun-fs-js`:  Implementation of [File System Standard](https://fs.spec.whatwg.org/) on top of [Bun File I/O](https://bun.sh/docs/api/file-io)
-   `@netapplabs/deno-fs-js`:  Implementation of [File System Standard](https://fs.spec.whatwg.org/) on top of [Deno File system APIs](https://docs.deno.com/deploy/api/runtime-fs/)
-   `@netapplabs/nfs-js`: Implementation of [File System Standard](https://fs.spec.whatwg.org/) for NFSv3 in pure WebAssembly
-   `@netapplabs/s3-fs-js`: Implementation of [File System Standard](https://fs.spec.whatwg.org/) for S3 protocol.
-   `@netapplabs/wasi-js`: WASI runtime layer written in TypeScript for JavaScript runtimes
-   `@netapplabs/shell`: a CLI shell package for wasm/wasi embedding a pre-built [Nushell](https://www.nushell.sh) shell compiled to [WebAssembly](https://webassembly.org) by default.

### Apps

Following applications are provided as examples for self contained executables built with the packages above.

-   `@netapplabs/node-shell`: a shell for wasm/wasi based on [node.js](https://nodejs.org/)
-   `@netapplabs/bun-shell`: a shell for wasm/wasi based on [bun.sh](https://bun.sh)
-   `@netapplabs/deno-shell`: a shell for wasm/wasi based on [deno](https://deno.com)
-   `@netapplabs/web-shell`: a Web shell for wasm/wasi runnable in a Browser.


## Using Packages

Make sure you have in your ~/.npmrc 

```
@netapplabs:registry=https://npm.pkg.github.com/
```

or if you have a GITHUB_TOKEN

```
//npm.pkg.github.com/:_authToken=${GITHUB_TOKEN}
@netapplabs:registry=https://npm.pkg.github.com/
```

Then add a package e.g. with

```sh
yarn add @netapplabs/wasi-js
```

or

```sh
bun add @netapplabs/wasi-js
```

## Running Apps

`wasmin` contains pre-built executables as an example built from the apps above in different formats:


### Container

#### Start up a default shell:

```sh
docker run -it ghcr.io/netapplabs/wasmin:main
```

Type in something like
```
help commands
```
to see available commands

#### For running with /Users/shared from local machine mounted into it:

```sh
docker run -it --mount type=bind,source=/Users/shared,target=/mount ghcr.io/netapplabs/wasmin:main
```

### Executable

For prebuilt with bun on macOS Apple Silicon:

```sh
wget https://github.com/NetAppLabs/wasmin/releases/download/main/wasmin-bun-macos-arm64 -O wasmin
chmod +x wasmin
./wasmin -h
```

For prebuilt with bun on Linux Intel:

```sh
wget https://github.com/NetAppLabs/wasmin/releases/download/main/wasmin-bun-linux-amd64 -O wasmin
chmod +x wasmin
./wasmin -h
```

For prebuilt with Node on macOS Apple Silicon:

```sh
wget https://github.com/NetAppLabs/wasmin/releases/download/main/wasmin-node-macos-arm64 -O wasmin
chmod +x wasmin
./wasmin -h
```

For prebuilt with Node on Linux Intel:

```sh
wget https://github.com/NetAppLabs/wasmin/releases/download/main/wasmin-node-linux-amd64 -O wasmin
chmod +x wasmin
./wasmin -h
```

For prebuilt with Deno on macOS Apple Silicon:

```sh
wget https://github.com/NetAppLabs/wasmin/releases/download/main/wasmin-deno-macos-arm64 -O wasmin
chmod +x wasmin
./wasmin -h
```

For prebuilt with Deno on Linux Intel:

```sh
wget https://github.com/NetAppLabs/wasmin/releases/download/main/wasmin-deno-linux-amd64 -O wasmin
chmod +x wasmin
./wasmin -h
```


## Development

Clone from github:

```
git clone git@github.com:NetAppLabs/wasmin.git
```

### Build

To build all apps and packages, run the following command:

```
cd wasmin
yarn
yarn build
```

### Test

To test all packages, run the following command:

```
cd wasmin
yarn test
```
## License

[Apache-2.0](LICENSE)

Disclaimer: _This is not an officially supported NetApp product._

## Contributing

See [Contributing.md](./CONTRIBUTING.md)
