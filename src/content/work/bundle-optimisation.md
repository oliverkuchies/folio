---
title: Bundle Optimisation
publishDate: 2025-03-02 00:00:00
image: /assets/projects/bundles.png
img_alt: Iridescent ripples of a bright blue and pink liquid
description: |
  I effectively reduced bundle sizes by 80% and further optimised future bundles.
tags:
  - Optimisation
  - Front End Development
  - Webpack
  - Esbuild
  - Pipelines
---

When reducing bundles, there have been numerous strategies which I have taken.
It all begins with a straight forward audit. Thankfully tools like webpack, esbuild etc - all support some kind of bundle size report, which helps break down the different contributing factors to a large bundle size.

**Once I had this report ready, I noticed a few issues**
1) We were duplicating modules across the bundle, multiple assets were being utilised up to 4 times, instead of once.
2) The file size minification was not resolving correctly
3) SVG files were bloating file with base64.
4) Inline CSS was bloating JS files.

**Across all projects, I performed the following**
1) **Enabled tree-shaking** - This enabled all JS bundles to reduce effectively, as only one import was being utilised instead of multiple - resulting in less duplication.
2) **Enabled minification** - This resulted in a reduction of around 70%. All file sizes were compressed with Gzip, and minified of any white spaces, large variables were reduced to minimal sizes, and code was optimised accordingly to reduce the file sizes. Minification was enabled via Terser for legacy platforms.
3) **Moved all SVG's out of bundle** - The SVGs were resulting in bloat as they were processed as base64 in the bundles. It made much more sense to deliver the SVGs separately, and then eventually deliver them via an SVG spritemap.

**Outcomes**
As a result of these changes, the client script is extremely small for most of our applications.
A reduction in >80% was seen, resulting in quicker loads for our customers.
