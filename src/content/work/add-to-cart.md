---
title: Add To Cart
publishDate: 2025-03-02 00:00:00
image: /assets/projects/add-to-cart.webp
img_alt: Add To Cart functionality for UGC Widgets using Shopify
description: |
  I developed an add to cart integration to allow customer facing websites to integrate with Shopify.
tags:
  - Front End Development
  - Back End Development
  - Microservices
  - Preact
  - Typescript
  - Storybook
  - Jest
  - Cypress
  - AWS S3
---

I developed the entirety of the Add To Cart UI, which utilised Shopify API to retrieve variants, pricing, stock levels etc.
The API utilised was cryptic, and had limited documentation - so it required reverse engineering to understand how data could be mapped from Shopify to our application.

Our application allowed users to add items to cart from the comfort of our widgets, i.e. outside of the default shopify view.

## Front End 
The application was developed Preact to reduce the amount of bloat associated with React, since this would be integrated in customer facing websites.

Typescript was utilised along with testing with Jest and Cypress, with Jest covering the Unit tests, and Cypress covering the E2E testing.

## Backend
A backend was developed to serve customisations made to the add to cart functionality.
Users could make mappings, which map their requirements for different mappings associated with the API.

I utilised AWS S3 to store customer data, as it was in JSON format and it was quite a swift integration with minimal latency.

I created a schema management system to allow the creation of configuration schemas so we could reuse the microservice for other applications in the future. 

In this case, the configuration management microservice was utilised to store the variant mappings.
The backend was tested with Supertest and built in NestJS