---
title: End To End Analytics
publishDate: 2025-03-02 00:00:00
img: /assets/projects/traffic-overview.webp
img_alt: Google Analytics integration
description: |
  I architected a Google Analytics integration which utilised persistent data tracking, and microservice interactions.
tags:
  - Front End Development
  - Back End Development
  - Microservices
  - React
  - AWS Lambda
  - Typescript
---

### UI
The UI was developed with Typescript and utilised Jest as a testing framework. Hydration occurred by utilising the lambda as a source of analytic data, and it utilised a user authenticated token to connect to both Google Analytics and the lambda.

### Micro Service / AWS Lambda
I utilised Google Analytics to process the data associated with user interaction, and created segments to divide the data accordingly.

This API was connected to via a lambda that was created with the single responsibility of interacting with the API, and required authentication with our legacy system once the user's session was initiated.

I utilised AES-256 encryption to ensure the security of tokens when interacting between services.

To minimise latency, provisioned concurrency was utilised along with asynchronous operations working concurrently upon each request.

### Static Email Tracking With Base64
In-order to utilise Google Analytics on a static email level, base 64 metadata was embedded into the image URLs of the images delivered to the user's email, and upon clicking the particular item - a tracking event was processed to the Google Analytic lambda.

### Persistent Ecommerce Tracking
Local Storage was utilised to allow persistent tracking across the user's session. Basically, when a user makes interactions - they are recorded in local storage and then later fetched by the client script to deliver to Google Analytics as a potential conversion. 

Local Storage was utilised due to limitations around data tracking where our widget was not available. A simple helper script was implemented to create a data-layer to support this.