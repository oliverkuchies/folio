---
title: How we created multi region S3 endpoints with low latency
publishDate: 2025-05-03 20:17:00
image: /assets/blog/how-we-created-multi-region-s3-endpoints-with-low-latency/icon.png
img_alt: S3 Icons
description: |
  We figured out a way to reduce latency across multiple regions, have a read to see how we accomplished this!
tags:
  - Amazon S3
  - Performance
  - Latency
  - Back End Development
  - Front End Development
  - Amazon Cloudfront
---

Our team was looking into multiple solutions to serve files fast across multiple regions for the first request pre-cache.

We noticed the limitations associated with region-based latency. Being in a region far from the server where the files are hosted impacts delivery substantially, think 300-800ms additional depending on the region your users are in.

At first, our team had a simple lambda configuration, where the lambda was delivering static assets via Express (a NodeJS framework). This was pretty swift in Sydney (ap-southeast-2) where the lambda was deployed, however; in other regions the latency was pretty high (800ms-1.5s for cold start).

We realized that this solution would not suffice, as users in the 95th percentile from another region would experience the cold start; impacting their experience on our application. 

I discovered an alternative solution - Multi Region Access Points (MRAP) provided by AWS. This looked promising, as it offered region based traffic control. After setting up the multi-region S3 replicas required by AWS to create the network of distribution, we came across a roadblock - this service required Sigv4a to be implemented, which would ultimately result in additional latency once again when setup behind a lambda@edge on cold starts. While cached requests would offer us the low latency we were looking for, unfortunately the 59th percentile would experienced a delayed response.

**We decided to build a bespoke solution which would ensure:**

1) Low latency
2) Traffic distributed based on user region, or closest distance to a region
3) No cold starts

In-order to do this, we decided to utilise S3 buckets once again, but utilise a solution like Cloudfront functions instead of lambda at edge.

Cloudfront functions are designed to perform better during cold starts, and are optimized for simple, short-lived tasks that can be executed quickly at the edge locations.

Once we had an S3 bucket ready, we created replicas across multiple other regions around the world.

Once the replicas were prepared, we created an algorithm which utilises the Haversine method, a mathematical method utilised to find the distance between two points on a sphere. While i'm no mathematician, this seemed to make perfect sense to me.

We listed the co-ordinates of each of the AWS regions, and utilised the Haversine method to compare the user's latitude and longitude to the AWS regions stored.

Here is how the AWS regions were stored.

```js
const awsRegions = [
  { name: 'us-east-1', lat: 38.95, lon: -77.45 },
  { name: 'us-east-2', lat: 40.0, lon: -83.0 },
  { name: 'us-west-1', lat: 37.78, lon: -122.42 },
  { name: 'us-west-2', lat: 45.6, lon: -122.67 },
  { name: 'ca-central-1', lat: 43.7, lon: -79.42 },
  { name: 'eu-west-1', lat: 53.33, lon: -6.25 },
  { name: 'eu-west-2', lat: 51.5, lon: -0.13 },
  { name: 'eu-west-3', lat: 48.85, lon: 2.35 },
  { name: 'eu-central-1', lat: 50.11, lon: 8.68 },
  { name: 'ap-northeast-1', lat: 35.68, lon: 139.76 },
  { name: 'ap-northeast-2', lat: 37.56, lon: 126.97 },
  { name: 'ap-southeast-1', lat: 1.35, lon: 103.82 },
  { name: 'ap-southeast-2', lat: -33.86, lon: 151.21 },
  { name: 'ap-south-1', lat: 19.08, lon: 72.88 },
  { name: 'sa-east-1', lat: -23.55, lon: -46.63 },
];
```

The user's lat & long can be retrieved with Cloudfront by utilising the following headers:

```js
const latitude =
    headers['cloudfront-viewer-latitude'] &&
    parseFloat(headers['cloudfront-viewer-latitude'].value);
  const longitude =
    headers['cloudfront-viewer-longitude'] &&
    parseFloat(headers['cloudfront-viewer-longitude'].value);
```

The function then loops through the available regions, and checks the user's lat & long with the region's lat and long..

```js for (const availableRegion of availableRegions) {
        const region = awsRegions.find(r => r.name === availableRegion);

        if (!region) {
            continue;
        }

        const distance = haversine(lat, lon, region.lat, region.lon);
        if (distance < minDistance) {
            minDistance = distance;
            closestRegion = region.name;
        }
    }
```

Once the closest region is determined, it can then be used in the cf function to redirect the user.

```js
 cf.updateRequestOrigin({
    domainName: domainName,
    originAccessControlConfig: {
      enabled: true,
      region: closestRegion,
      signingBehavior: 'always',
      signingProtocol: 'sigv4',
      originType: 's3',
    },
  });
```

The Closest AWS Bucket function can be found here, but require a quick `npm run build` to produce a compiled JS file for the CF function.
https://github.com/oliverkuchies/closest-aws-bucket/tree/main

Here is the source of the entire CF function.
```js
function handler(event) {
  var request = event.request;
  const headers = request.headers;

  const latitude =
    headers['cloudfront-viewer-latitude'] &&
    parseFloat(headers['cloudfront-viewer-latitude'].value);
  const longitude =
    headers['cloudfront-viewer-longitude'] &&
    parseFloat(headers['cloudfront-viewer-longitude'].value);

  const availableRegions = ['us-east-1', 'ap-southeast-2', 'eu-west-1'];

  const DEFAULT_REGION = 'us-east-1';
  const selectedRegion =
    closestS3Region(latitude, longitude, availableRegions) || DEFAULT_REGION;
  const domainName = your-bucket-name-here-${selectedRegion}.s3.${selectedRegion}.amazonaws.com;

  cf.updateRequestOrigin({
    domainName: domainName,
    originAccessControlConfig: {
      enabled: true,
      region: selectedRegion,
      signingBehavior: 'always',
      signingProtocol: 'sigv4',
      originType: 's3',
    },
  });

  return request;
}
```

As a result of applying Cloudfront functions and allowing it to distribute users across to different S3 buckets, we saw the latency of user requests drop substantially, think around 300-600ms depending on previous user distance to our lambda.

I hope its a helpful solution for others out there as it was for our team! Please do leave any feedback or potential improvements to our solution and i'll gladly consider it!