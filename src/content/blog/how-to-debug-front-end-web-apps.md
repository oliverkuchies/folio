---
title: How to debug front-end web apps
publishDate: 2025-03-23 16:55:00
image: /assets/blog/how-to-debug-front-end-web-apps/image.png
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

### Configuring sourcemaps in your browser settings

To enable sourcemaps in your browser, please enable the following settings as the image below. They will enable sourcemaps to be loaded from remote sources, localhost, and sourcemaps that are CSS & JS based will be loaded accordingly.

![Sourcemap settings](/assets/blog/how-to-debug-front-end-web-apps/source-map-settings.png)

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

## Searching through sourcemaps
In-order to search through sourcemaps, you need to toggle the search bar which will appear at the bottom of your developer tools.

Depending on the browser you are utilising, this may appear different - but the core functionality should be there.

The image below will display how to enable search.

![Enable searching in sourcemaps](/assets/blog/how-to-debug-front-end-web-apps/enable-search.png)

Once search is enabled, you can begin your search through the sourcemaps and distributed JS/CSS code.

![Enable searching in sourcemaps](/assets/blog/how-to-debug-front-end-web-apps/searching-sourcemaps.png)

Very easy to utilise! And a massive lifesaver when debugging. While this feature is widely available, many developers overlook the option to search the source code, and result to constantly scanning through their IDE code.
Sometimes searching through sourcemaps can speed up the debugging process.

## Utilising breakpoints
Breakpoints are a life saver! Why console.log across your codebase when you can see all the variable values at given points in the application's life cycle?

By clicking on the panel on the right hand side next to the line number of code, you can enable a breakpoint for that line of code.

This means that when the application is about to execute that line of code, the application freezes, and allows you to assess the values of variables at that given state.

By putting your mouse over given variables, you can see their values. You can also utilise the arrow on the top of the right panel to continue allowing your application to step through the code.

![Breakpoints in action](/assets/blog/how-to-debug-front-end-web-apps/breakpoints-in-action.png)

On the right hand bar, you can also monitor which line of code had called the given method, allowing you to track execution across complex applications.

You will also find more advanced usages of breakpoints on the right hand bar. For example, you can click **Event Listener Breakpoints** to listen to calls of particular events, for instance - a click event.

There are a multitude of ways to debug applications, but I have demonstrated a few above and I hope they are helpful to your code practices.

Happy debugging!