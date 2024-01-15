# @wethegit/masher

> A simple CLI tool to compress images.

## Requirements

Node 20.10.0 or higher.

## Install

```bash
npm install @wethegit/masher
```

## Usage

By default the masher will look for images in a `src/images` directory and output them to a `public/_images` directory.

You can change that by adding a `masher.config.js` file to your project root.

```json
{
  "outputPath": "public/_images/",
  "inputPath": "src/images/"
}
```

This file will also be generate for you the first time you run the masher.

```bash
npx @wethegit/masher
```

To watch for changes and automatically compress images run:

```bash
npx @wethegit/masher --watch
```

For a list of all available options run:

```bash
npx @wethegit/masher --help
```
