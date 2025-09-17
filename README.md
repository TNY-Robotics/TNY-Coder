# TNY Coder
Desktop application for programming your TNY robot !

## Requirements
- [Node.js](https://nodejs.org/) v14 or later
- [NPM](https://www.npmjs.com/) v6 or later

## Installation

### 1. Clone the repository

```bash
git clone https://github.com/TNY-Robotics/TNY-Coder
```

### 2. Install dependencies

```bash
cd TNY-Coder
npm install
```

## Running the app

### 1. In browser

```bash
npm run dev
```

### 2. In electron

```bash
npm run dev:electron
```

## Building the app

### 1. Nuxt web server 

```bash
npm run build
```

### 2. Static website

```bash
npm run generate
```

### 3. Electron app

```bash
npm run build:electron
```

> [!NOTE] 
> Building on windows requires the terminal session to be run as administrator for the first time,
> as described in [this issue](https://github.com/electron-userland/electron-builder/issues/8149).

