---
title: How to lazy load web components
publishDate: 2025-05-25 16:07:00
img: /assets/blog/how-to-lazy-load-web-components/image.png
img_alt: Lazy Loading Web Components
description: | 
  Lazy loading, when used correctly can enhance user experience. Have you tried lazy loading your web components?
tags:
  - Front End Development
  - Lazy Loading
  - Optimisation
---

## What is lazy loading?

Lazy loading is a technique used in front-end development which allows components to be loaded at the time that they are required.

While browsers generally tend to load all assets at once, lazy loading allows the asset to be loaded when the user scrolls into the view, or loads a particular element that is relevant to the user at that given point in time.

## What are web components?

Web components are reusable components in the browser. Think JSX without the build process required. 

They can be utilised by simple tags, such as <hello></hello> and are registered within an encapsulated Javascript file.

For instance:

```ts
class Hello extends HTMLElement {
    constructor() {
        super();
        const shadow = this.attachShadow({ mode: 'open' });
        const wrapper = document.createElement('div');
        wrapper.textContent = 'Hello, World!';
        shadow.appendChild(wrapper);
    }

    customElements.define('hello', Hello);
}
```

Now, with this in mind - how do we setup lazy loading with your new web component?

## Intersection Observers

Intersection Observers are a reliable browser API that allows users to capture intersections between two given objects in the DOM.

They are well known for enabling lazy loading to take place.

In this instance, due to the encapsulation of web components - intersection observers are a great option as we can dictate when the visual components of the web component are actually rendered.

Lets refactor our web component to enforce clean code standards and demonstrate how we can control our rendering.

```ts
class Hello extends HTMLElement {
    constructor() {
        super();

        this.render();
    }

    private function render() {
        const shadow = this.attachShadow({ mode: 'open' });
        const wrapper = document.createElement('div');
        wrapper.textContent = 'Hello, World!';
        shadow.appendChild(wrapper);
    }

    customElements.define('hello', Hello);
}
```

Great.. now we can control when our render takes place.

Lets create a new method to render when the user's viewport has intersected with our web component. 

```ts
function renderOnIntersect() {
 const intersectionObserver = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          intersectionObserver.unobserve(entry.target)
          this.render()
        }
      })
    })
    intersectionObserver.observe(this)
}
```

This method does four things:

1) Initialises the intersection observer
2) Checks for all browser intersections with the component.
3) Stops observing when one intersection is performed
4) Performs the render

```ts
class Hello extends HTMLElement {
    constructor() {
        super();

        this.renderOnIntersect()
    }

    private function render() {
        const shadow = this.attachShadow({ mode: 'open' })
        const wrapper = document.createElement('div')
        wrapper.textContent = 'Hello, World!'
        shadow.appendChild(wrapper)
    }

    function renderOnIntersect() {
      const intersectionObserver = new IntersectionObserver(entries => {
            entries.forEach(entry => {
              if (entry.isIntersecting) {
                intersectionObserver.unobserve(entry.target);
                this.render();
              }
            })
          })
          intersectionObserver.observe(this);
      }

    customElements.define('hello', Hello);
}
```

Congratulations, you have now ensured that the <hello> web component only loads when a user scrolls past it!
