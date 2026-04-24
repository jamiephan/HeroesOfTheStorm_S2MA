# HeroesOfTheStorm_S2MA
A repository for hosting Heroes of the Storm `*.s2ma` files.

## What is `*.s2ma`?
This repo hosts the `*.s2ma` files from Heroes of the Storm. Most `*.s2ma` files use the [MPQ format](http://www.zezula.net/en/mpq/mpqformat.html) and can be viewed or edited with [MPQ Editor](http://www.zezula.net/en/mpq/download.html). Because they are MPQ files, they can be loaded into the game much like other mods and maps.

In Heroes, there are three types of `*.s2ma` content:

- Mods: `*.stormmod` files that can be included by other mods or maps.
- Maps: `*.stormmap` files that can be run directly or side-loaded into the game by replacing single-player maps.
- Text: Metadata files, which are probably less useful (`null` type in [`TABLE.md`](TABLE.md)).

> If you want to run a map from [./maps](maps), see https://jamiephan.github.io/HeroesOfTheStorm_TryMode2.0/install.html

## Why?

Originally, this repo only served as a hosting repository for [Try Mode 2.0](https://github.com/jamiephan/HeroesOfTheStorm_TryMode2.0). That project injects custom files and data into maps and publishes them through [GitHub Releases](https://github.com/jamiephan/HeroesOfTheStorm_TryMode2.0/releases).

Now it serves as the main hosting repo for all `*.s2ma` files.

## Features

- Hosts all `*.s2ma` files from Heroes of the Storm.
- Automatically detects whether a file is a map or a mod.
- Automatically renames mod and map files so they are easier to identify.
- Automatically generates [`TABLE.md`](TABLE.md), which indexes all `*.s2ma` files.
- [A GitHub Action is set up](https://github.com/jamiephan/HeroesOfTheStorm_S2MA/actions) to fetch the latest `*.s2ma` files from a fresh Heroes of the Storm installation every 4 hours.
  - If you want to do something similar, take a look at [`ci.js`](https://github.com/jamiephan/HeroesOfTheStorm_S2MA/blob/main/scripts/ci.js). It uses my [bindings for CASCLib and StormLib](https://github.com/jamiephan/casclib-stormlib-monorepo) to run natively.

## Directories

- [`./s2ma`](s2ma): All the `*.s2ma` files extracted from Heroes of the Storm, via the `npm run ci` command.
- [`./mods`](mods): All the `*.stormmod` files, copied and renamed from the s2ma files above.
- [`./maps`](maps): All the `*.stormmap` files, copied and renamed from the s2ma files above.
- [`./extra_maps`](extra_maps): Extra maps from `mods/heroes.stormmod/base.stormmaps/maps`, compiled with [@jamiephan/stormlib](https://github.com/jamiephan/casclib-stormlib-monorepo/tree/master/packages/stormlib) and not present in the `*.s2ma` files.

## Documentation

- [`README.md`](README.md): This README file.
- [`TABLE.md`](TABLE.md): Generated documentation showing which `*.s2ma` files correspond to which map or mod file.

## Tools

- `npm run ci`: Extracts all `*.s2ma` files from Heroes of the Storm, categorizes them by type, and renames them to make them easier to identify.

## AI in Maps

To keep this repo clean and pure, all `*.s2ma` files are unmodified. If you load one of these maps, it will not include any AI.

If you want AI in the game, visit [jamiephan/HeroesOfTheStorm_AIMaps](https://github.com/jamiephan/HeroesOfTheStorm_AIMaps). That repo generates various AI configurations and map files based on this repo.
