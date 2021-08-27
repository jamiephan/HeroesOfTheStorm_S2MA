# HeroesOfTheStorm_S2MA
A repo to host `*.s2ma` files from Heroes of the Storm

## What is `*.s2ma`?
This repo host all the `*.s2ma` files from Heroes of the Storm. `*.s2ma` are mostly in a [MPQ format](http://www.zezula.net/en/mpq/mpqformat.html) that can be viewed/edit via [MPQ Editor](http://www.zezula.net/en/mpq/download.html). Due to it is just an MPQ file, it can be loaded into the game easily just like other mods and maps.

In Heroes, there are two type of *.s2ma: 

 - Mods: Which are `*.stormmod`, can be included by other mods or maps
 - Maps: Which are `*.stormmap`, can be run directly or side loaded into the game by replacing single player maps

> If you would like to run the map in [./maps](maps), please refer to https://jamiephan.github.io/HeroesOfTheStorm_TryMode2.0/install.html 

## Why?

Originally, this repo was only act as a hosting map files for [Try Mode 2.0](https://github.com/jamiephan/HeroesOfTheStorm_TryMode2.0). It will inject the custom made files/data to the maps and creates a [Github Release](https://github.com/jamiephan/HeroesOfTheStorm_TryMode2.0/releases) for downloads. 

Now, it will act as a main hosting repo for all the `*.s2ma` files.

## Features

- Hosting all the `*.s2ma` files from Heroes of the Storm
- Automatically detect whether its a map or mod file.
- Automatically rename the mod/map file, so its much easier to find the file you want
- Automatically Generate [`TABLE.md`](TABLE.md) that index all the `*.s2ma` files
- [A Github Action have been setup](https://github.com/jamiephan/HeroesOfTheStorm_S2MA/actions) to fetch the latest `*.s2ma` files from a fresh Heroes of the Storm installation game files automatically everyday.
  - (If you want to do something similar, you can have a look [`fetch_s2ma.yml`](https://github.com/jamiephan/HeroesOfTheStorm_S2MA/blob/main/.github/workflows/fetch_s2ma.yml) file. It took me a while to figure it how to do it. Also due to rate limits, it is recommended to not download the game files more than once 30 minutes regularly, or Blizzard's server may temporarily block the connection.)

## Directories

- [`./s2ma`](s2ma): All the `*.s2ma` files extracted from Heroes of the Storm, via the `npm run extract:s2ma` command.
- [`./mods`](mods): All the `*.stormmod` files, copied renamed from the s2ma files above.
- [`./maps`](maps): All the `*.stormmap` files, copied renamed from the s2ma files above.
- [`./extra_maps`](extra_maps): Extra maps from the `mods/heroes.stormmod/base.stormmaps/maps`, which was compiled manually and not present in the `*.s2ma` files.

## Documentations:

- [`README.md`](README.md): This README file.
- [`TABLE.md`](TABLE.md): Generated documentation that shows which `*.s2ma` files are corresponding to which map/mod file.

## Tools:

- `npm run extract:s2ma`: Extract all `*.s2ma` files from Heroes of the Storm (Prerequisite please see: https://jamiephan.github.io/HeroesOfTheStorm_TryMode2.0/tools.html)
- `npm run rename`: Rename, copy the `*.s2ma` files to its respective directory and generate [`TABLE.md`](TABLE.md). (Windows Only)

## AI in Maps:

To keep this repo clean and *pure*, all the `*.s2ma` file are unmodified, therefore if you load one of the maps, it will not have any AI included.

If you want AI in the game, please visit [jamiephan/HeroesOfTheStorm_AIMaps](https://github.com/jamiephan/HeroesOfTheStorm_AIMaps). This repo will generate various of AI configurations and map files were based on this repo.
