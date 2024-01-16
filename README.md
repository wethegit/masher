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

You can change that by adding a `masher.config.json` file to your project root.

```json file=masher.config.json
{
  "outputPath": "public/_images/",
  "inputPath": "src/images/"
}
```

This file will also be generate for you the first time you run the masher.

If you add images to the `inputPath` that have the `-2x` suffix on their filenames, for example, `/src/images/banner-logo-2x.png`, `masher` will not only compress these images but it will also automatically generate a `1x` version of them.

After adding your images to the `inputPath` you can run the masher by running:

```bash
npx @wethegit/masher
```

Folloing the example if you have the following directory structure:

```
src/
└── images/
    └── banner-logo-2x.png
```

The masher will generate PNGs and WEBPs for both `banner-logo-2x.png` and `banner-logo.png` in the `public/_images` directory:

```
public/
└── _images/
    ├── banner-logo-2x.png
    ├── banner-logo-2x.webp
    ├── banner-logo.png
    └── banner-logo.webp
```

Apart form the config file, the masher will create two more files in your project root, one called `mash.cache.json` and another called `images_register.json`.

`mash.cache.json` should be added to your `.gitignore` file as it will be used to keep track of the images that have already been compressed and will be used to skip them on subsequent runs.

`images_register.json` is a file that will be used to keep track of the images that have been compressed and will be used to generate a `1x` version of the images that have a `-2x` suffix on their filenames. **Note for Corgi users:** this file will be used by the `<Picture />` component to generate the `srcSet` attribute of images.

### Accepted image formats

The masher will only compress images that have the following extensions:

- png
- webp
- jpg
- jpeg

## Options

`--watch`
This will start the masher in watch mode, meaning that it will keep running and will compress any new images that are added to the `inputPath`.

```bash
npx @wethegit/masher --watch
```

`--clean`
This will delete the `outputPath` directory before running the masher.

```bash
npx @wethegit/masher --clean
```

`--force`
This will force the masher to compress all images, even if they have already been compressed.

```bash
npx @wethegit/masher --force
```

To see all available options run:

```bash
npx @wethegit/masher --help
```
