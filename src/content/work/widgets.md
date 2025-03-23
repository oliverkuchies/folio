---
title: Widgets
publishDate: 2025-03-02 00:00:00
img: /assets/stock-1.jpg
img_alt: Iridescent ripples of a bright blue and pink liquid
description: |
  I lead the development of a template framework for our widgets which face millions.
tags:
  - Front End Development
  - Back End Development
  - Pipelines
  - NestJS
  - Docker
  - AWS ECS
  - Typescript
---

In all honestly, this has been the largest project i've ever worked on.
The widgets are a core product for the organisation I am working for, and they face millions of users a week.
The development of the widgets required careful consideration to create optimal conditions for our users to enjoy a seamless experience when loading the widgets on their browser.

When developing the project, there were two main considerations in mind to cater for our customers.

1) The widgets **must** load fast
2) The widgets **must** be customisable

### Back End Development

The backend was build with NestJS, which enabled us to build it quickly and reliably.
It was deployed with AWS ECS, and built on a Docker container where the environment was self contained.
I utilised Server Timing headers to assess the performance of the backend and debug where any delays existed.

### Front End Development

The frontend was built with Typescript, custom JSX, and JS.
It consisted of two parts.
1) The business logic
2) The custom templates which customers could create.

I created an abstraction which allowed custom templating by passing an SDK to the customer. The SDK was hoisted in the outer scope of the template context, allowing customers to utilise an 'sdk' const to build their code.

A typesafe Typescript repository was created to allow customers to create these templates with ease, while also supporting Cypress for E2E testing, and Jest for JSX testing.

Styling utilised SCSS.

I built the pipeline process which allowed all templates to be built with ease, and tested locally. The templates were built with ESBuild.

All output files were carefully optimised by enabling tree chunking, minification, and disabling bundling on sub-repos to assist with the tree shaking process. SVG stylemaps are generated but are yet to be utilised, this would also offer a performance boost.



