# wasm-env

Thiis is a monorepo for wasm/wasi based runtimes.

## About

This repo is baed on [turborepo](https://turborepo.org) and uses [Yarn](https://classic.yarnpkg.com/lang/en/) as a package manager. It includes the following packages/apps:

### Apps and Packages

-   `fs-js`: FileSystem layer based on WHATWG [File System Standard](https://fs.spec.whatwg.org/)
-   `wasi-js`: WASI runtime layer written in TypeScript for JavaScript runtimes
-   `node-shell`: a shell for wasm/wasi based on [node.js](https://nodejs.org/)
-   `bun-shell`: a shell for wasm/wasi based on [bun.sh](https://bun.sh)
-   `eslint-config-custom`: `eslint` configurations (includes `eslint-config-next` and `eslint-config-prettier`)
-   `tsconfig`: `tsconfig.json`s used throughout the monorepo

Each package/app is 100% [TypeScript](https://www.typescriptlang.org/).

### Utilities

This turborepo has some additional tools already setup for you:

-   [TypeScript](https://www.typescriptlang.org/) for static type checking
-   [ESLint](https://eslint.org/) for code linting
-   [Prettier](https://prettier.io) for code formatting

## Setup

Clone from github:

```
git clone git@github.com:NetAppLabs/wasm-env.git
```

### Build

To build all apps and packages, run the following command:

```
cd wasm-env
yarn
yarn build
```

### Develop

To develop all apps and packages, run the following command:

```
cd wasm-env
yarn dev
```
