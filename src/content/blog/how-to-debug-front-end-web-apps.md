---
title: All you need to know about sourcemaps
publishDate: 2025-03-23 16:55:00
img: /assets/blog/how-to-debug-front-end-web-apps/image.png
img_alt: Debugging front end applications
description: |
  Front end applications can be tricky to debug. This guide will tell you where to start
tags:
  - Front End Development
  - Debugging
  - Sourcemaps
---
When developing front end applications, developers are often tempted to debug their applications in repetitive manners which take extensive time and deliver little results.

One of these is the infamous **console.log()** methods, where a developer runs through the code console logging each of their lines of code to determine where the error lies.

I can admit, that I have indeed taken the route to debug many times - but I have found that utilising sourcemaps, search and inline breakpoints have assisted my development practice substantially.

In this article, I will go through each of the above and note how they have assisted my growth as an engineer.

## Sourcemaps

When developing a frontend application, sourcemaps are your best friend.

Without sourcemaps, the source code is lacking important information as it is only showing the compiled code. This may make it difficult to establish breakpoints, or understand where the error lies in your compiled code.

While it is still possible, it is not ideal - and sourcemaps would make life easier.

Here is an example of source code without sourcemaps.

![Debugging without sourcemaps](/assets/blog/how-to-debug-front-end-web-apps/without-sourcemaps.png)

When sourcemaps are enabled, the initial Typescript source is included, which makes it easier to track the source of an error when debugging. 

Note test.ts included in the source explorer.

![Debugging with sourcemaps](/assets/blog/how-to-debug-front-end-web-apps/with-sourcemap.png)

To demonstrate the impact this has on debugging, I will add a simple error into the source code. 

When the counter is incremented to 5, I will throw an exception.

![An error located in sourcemaps](/assets/blog/how-to-debug-front-end-web-apps/finding-errors.png)

Perhaps this is a poor example, but you can see that the error is thrown on line 11 in the source code - which enables a quick resolution of the error for the engineer. 

When code is built for a particular ES version of JS, for example - to ES2015 - you may notice particular newer JS features become simplified to support older browsers. For instance: 

```
const myPlanet = "Jupiter";

const myStatement = `Hello ${myPlanet}`
``` 

Which would become:

```
var myPlanet = "Jupiter";

var myStatement = "Hello " + myPlanet;
```

Sourcemaps are also helpful in this situation, because they will deliver the initial code with the constants and template literals.

When codebases get large, and are filled with many imports - sourcemaps are an absolute necessity for debugging as you can quickly locate errors across multiple files.

### Types of sourcemaps

#### Inline Sourcemap

In the examples above, I was utilising inline sourcemaps.

When inline sourcemaps are utilised, base64 code is embedded into the primary output JS file.

When source code is quite large, this may create extremely large JS files; but when a project is relatively small-mid sized, this is a suitable choice (to prevent performance issues in terms of loading the JS file).

![Inline sourcemap](/assets/blog/how-to-debug-front-end-web-apps/inline-sourcemap.png)

#### External Sourcemap

External sourcemaps create sourcemaps which can be hosted externally via a static asset store. When these files are created, they often end in .map and can be accessed vi an external URL.

However, you will need to add this sourcemap URL manually in your developer tools to see it in action. For instance, by right clicking the source code (displayed in the image below) - it will allow you to include your sourcemap manually.

![Debugging with external sourcemaps](/assets/blog/how-to-debug-front-end-web-apps/external-sourcemap.png)

#### Linked Sourcemap

Linked sourcemaps are very similar to external sourcemaps, except they automatically link the file to the external sourcemap. This is helpful if you are looking to keep the bundle size slim as inline sourcemaps can inflate the JS file size.

![Debugging with linked sourcemaps](/assets/blog/how-to-debug-front-end-web-apps/linked-sourcemap.png)

I hope this resource was helpful to you or your team, feel free to drop a comment below if you have any suggestions on improving it or any other interesting findings you've made regarding sourcemaps.