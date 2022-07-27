# wasm-env

Thiis is a monorepo for wasm/wasi based runtimes.

## About

This repo is baed on [turborepo](https://turborepo.org) and uses [Yarn](https://classic.yarnpkg.com/lang/en/) as a package manager. It includes the following packages/apps:

### Apps and Packages

- `fs-js`: FileSystem layer , needs to be cloned from [https://github.com/NetAppLabs/fs-js](https://github.com/NetAppLabs/fs-js)
- `wasi-js`: WASI layer , needs to be cloned from [https://github.com/NetAppLabs/wasi-js](https://github.com/NetAppLabs/wasi-js)
- `web-shell`: a web based shell for wasm/wasi
- `node-shell`: a web based shell for wasm/wasi
- `eslint-config-custom`: `eslint` configurations (includes `eslint-config-next` and `eslint-config-prettier`)
- `tsconfig`: `tsconfig.json`s used throughout the monorepo

Each package/app is 100% [TypeScript](https://www.typescriptlang.org/).

### Utilities

This turborepo has some additional tools already setup for you:

- [TypeScript](https://www.typescriptlang.org/) for static type checking
- [ESLint](https://eslint.org/) for code linting
- [Prettier](https://prettier.io) for code formatting

## Setup

fs-js and wasi-js need to be copied in from separate repositories

```
cd wasm-env
cd packages
git clone git@github.com:NetAppLabs/fs-js.git
git clone git@github.com:NetAppLabs/wasi-js.git
```

### Build

To build all apps and packages, run the following command:

```
cd wasm-env
yarn run build
```

### Develop

To develop all apps and packages, run the following command:

```
cd wasm-env
yarn run dev
```