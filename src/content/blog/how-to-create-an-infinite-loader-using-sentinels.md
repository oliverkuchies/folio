---
title: How to create an infinite loader using sentinels
publishDate: 2025-07-20 15:47:00
description: |
  Want content to load infinitely without the hassle? Try sentinels.
tags:
  - Front End Development
---

## What is an infinite loader?

An infinite loader is a technique utilised by many websites to enable the seamless loading of content while scrolling through a page. 

While in the past many applications utilised pagination with numbers, infinite loaders allow users to load as much content as they want, without having their user experience interrupted by continuous page refreshes.

## Previous approaches to infinite loaders

A lot of engineers will opt for a mathematical approach for loading more content, which generally involves assessing the user's current scroll location, and assessing whether the bottom of their screen has intersected with the end of the content. If this intersection occurs, then it is clear that the user will require more content to load. 

This is generally done by utilising values such as window.scrollY, and determining a rough Y co-ordinate of the content at hand with dynamic JS code.

However, with the evolution of browsers, we can utilise new tools to accomplish this in an easier way.

## Sentinels and intersection observers

Sentinels are generally defined as guards, or watchmen - who keep watch at all times. 
This is basically what we will be implementing here.

We will implement a sentinel div that is hidden to the user, but visible to the browser.

Once that div is created, we will create an intersection observer to monitor the user's browser to see if it is intersecting with our element of choice (the sentinel), and load more content when required.

Lets begin..

### Creating the sentinel

To create a sentinel, we need a div that is hidden to the user, but also visible to the browser.
This means that using ```display: none;``` is not an option.
However, we can do the following.

```html
<div id="sentinel"></div>
```

```css
#sentinel {
  height: 1px;
  visibility: hidden;
}
```

This will create an element that is hidden from the user, but visible to the browser, and 1px shouldn't make too much difference to the overall UX of the page.

### Creating the intersection observer
Now, we need to create an intersection observer which will listen for any entries that intersect with the element of choice, in our case - the sentinel.

The script should look like the following:

```js
const options = {
    threshold: 1.0,
};
  
function loadMore(entries) {
    entries.forEach((entry) => {
    if (entry.isIntersecting) {
      alert('loading more content!');
      return;
    }
  });
}

const observer = new IntersectionObserver(loadMore, options);
observer.observe(document.querySelector("#sentinel"));
```

A few key things to point out in the code snippet above:

1) The threshold defined provides the browser with a level of sensitivity for the intersection. In our case, since its only one pixel, the sentinel will always be 100% intersected when scrolled past. However, if the sentinel was an extremely large div, only percentages will be viewed at a time which is where a threshold can be lowered to suit your application's needs.
2) The load more function is essentially a callback, and it can be named however appropriate for your needs. You may choose to decouple your load more logic, so perhaps you can name it ``` sentinelIntersectCallback``` or something along those lines.
3) Inside the loadMore function, when ```entry.intersecting``` is true, you should call your infinite load logic. To add more content to the page, you can simply create more divs dynamically and insert them as required.
   

Congratulations on your new infinite loader. For a full demonstration on how this would operate in realtime, please see the snippet below.

```html
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width">
  <style>
    body {
      background-color: yellow;
      height: 3000px;
    }
    
    #filler {
      height: 2000px;
      background-color: blue;
    }
    
    #sentinel {
      height: 1px;
      visibility: hidden;
    }
  </style>
</head>
<body>
  <div id="filler"></div>
  <div id="sentinel"></div>
<script>
  const options = {
    threshold: 1.0,
  };
  
  function loadMore(entries) {
    entries.forEach((entry) => {
    if (entry.isIntersecting) {
      alert('loading more');
      return;
    }
  });
  }

  const observer = new IntersectionObserver(loadMore, options);
  observer.observe(document.querySelector("#sentinel"));
</script>
</body>
</html>
```
