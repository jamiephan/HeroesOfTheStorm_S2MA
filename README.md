# HeroesOfTheStorm_S2MA
A repo to host `*.s2ma` files from Heroes of the Storm

## What is `*.s2ma`?
This repo host all the `*.s2ma` files from Heroes of the Storm. `*.s2ma` files are mostly in MPQ files that contain extra files (such as assets, scripts, XMLs) that could not be found by extracting CASC directly (although `*.s2ma` files were extracted from CASC).

## Why?
This is a trimmed down version of `npm run extract:s2ma` from [Try Mode 2.0](https://github.com/jamiephan/HeroesOfTheStorm_TryMode2.0). 

It also act as an hosting for building multiple map files in Github Workflow for [Try Mode 2.0](https://github.com/jamiephan/HeroesOfTheStorm_TryMode2.0).

In addition, it will also trying to extract the mod/map name and rename the `*.s2ma` file and copy it to its corresponding directory for easier future reference.

## Directories:

- `./s2ma`: All the `*.s2ma` files extracted from Heroes of the Storm, via the `npm run extract:s2ma` command.
- `./mods`: All the `*.stormmod` files, copied renamed from the s2ma files above.
- `./maps`: All the `*.stormmap` files, copied renamed from the s2ma files above.
- `./extra_maps`: Extra maps from the `mods/heroes.stormmod/base.stormmaps/maps`, which was compiled manually and not present in the `*.s2ma` files.

## Documentations:

- `README.md`: This README file.
- `TABLE.md`: Generated documentation that shows which `*.s2ma` files are corresponding to which map/mod file.

## Tools:

- `npm run extract:s2ma`: Extract all `*.s2ma` files from Heroes of the Storm (Prerequisite please see: https://github.com/jamiephan/HeroesOfTheStorm_TryMode2.0/blob/master/TOOLS.md#prerequisite)
- `npm run rename`: Rename and copy the `*.s2ma` files. (Windows Only)

