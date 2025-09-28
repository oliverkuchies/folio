---
title: Overcoming the legacy stack blues
publishDate: 2025-09-27 14:24:00
image: /assets/og/overcoming-the-legacy-stack-blues.png
description: | 
  Legacy Stack are the words every engineer dread, but you can overcome it.

tags:
  - Front End Development
  - Back End Development
---


Legacy stack.. the two words many dread.

When you hear these words, you may immediately think:
- Spaghetti code
- Lack of tests
- Broken build processes
- Slow development processes
- Outdated tools & technology

In a previous role of mine, I saw all of these issues plus more.

But our team accomplished the unthinkable, and walked out the other end with completely renewed engineering minds.

In this story i'll share my experience, and the transformation that I saw in myself as we navigated through the legacy stack blues.

As you read I would encourage you to think about whether you face some of these challenges in your workplace, and if you do, please be encouraged - you can overcome them!

## Defining The Legacy Stack Blues

With a quick Google search of "legacy stack blues", I couldn't find one definition. 

So let's create a definition which can be used for the sake of this article.

According to IBM, "Legacy code refers to _software code that still serves its purpose_ but was developed using now outdated technologies.".

And blues refers to "feelings of melancholy, sadness, or depression."

With this in mind, we can define **legacy stack blues** as the following:

Feelings of melancholy, sadness or depression that come as a result of maintaining or supporting software utilizing outdated technologies.

In most of the organizations that I have worked in I have experienced a sense of these blues.

Below, I will list some of the different legacy stack blues I experienced and how our team conquered them.

## Dated development machine & on boarding

My new role begins as a full stack engineer at an organization where I receive my laptop in the mail, and the first sign of legacy stack blues manifested itself.. the machine I received had an outdated processor and was second hand because it was difficult to obtain this particular model as a new device on the market. 

The version of Vagrant our stack utilized required a MacOS with an Intel Chip and that made it incompatible with Apple silicon chips (the more performant model at the time).

My machine was alright, but mediocre at best. It would slow down after opening a few IDE windows, and the battery life was abysmal (due to being second-hand). I had to have the battery replaced at the local Apple store as a result, and the amount of output was quite slow at the time.

### How we fixed our local machine issues

In order to overcome our sub-par development environment, our team made the transition to utilize Docker containers instead of Vagrant Boxes. 

The transition was quite straight forward as Docker containers offer a similar level of isolation to Vagrant boxes. 

The networking associated with Docker containers was a lot easier to manage, and it allowed our team to scale new services with ease and also connect our microservices together. 

Docker containers by nature are quite lightweight, while Vagrant boxes are a lot bulkier (as they run an entire OS), which means booting them up was seamless.

## Slow Development Processes

Once my machine was setup, I began cloning the necessary Github repositories (the product was operating in a micro-service architecture so there were a few of them).

On first observation, I noticed `npm install` was quite flakey on a few repositories. Particular dependencies were failing to install when running the command for a few reasons:

- Dependencies stripped from npm archive
- Dependency package conflicts
- Machine version incompatibilities with the npm package binaries

My team would suggest at the time that they all shared the same issue, at the time there was no motivation to fix it. 

I believe this was a symptom of the legacy stack blues. 

Some of these services were tested only in a QA environment where the infrastructure and pipelines supported these broken build systems, this was the team norm. There was limited automated testing, and where it existed it was not maintained.

As I was assigned my first task, I was ready. I had npm installed along with all the necessary dependencies. My initial instinct as an engineer working on the frontend was to execute `npm run start`, so I did. 

However, it looked like the start command failed. 

Then, I attempted to execute `npm run build`. It took around 5 minutes for the build to complete successfully.

This was an extremely critical bottleneck in the development workflow. 

It meant that each engineer was not motivated to use their local development environment and chose to utilise a QA environment to test their code changes instead. It was not ideal.

### How we resolved our slow build process & broken dependencies

In order to fix the slow build process, I knew we would need to do something about our machines (as a Silicon Mac Chip would improve speed substantially). 

At the time I did not have the authority to make that decision, so I decided to discover other contingencies. 

I decided to introduce my team to Esbuild. At the time it was still in early release, but the speed improvement that it offered was exactly what our team needed. 

I replaced the bundling of our largest JS and CSS bundle with Esbuild configuration. I enabled tree-shaking and minification to keep the bundle slim. 

I decoupled this bundle from the rest of the webpack configuration.

Immediately a team member pings me and notices a significant speed improvement. Bundling would now occur on our sub par machines in less than 30 seconds.

If I performed the exercise again I would have focused on pushing for our machines to be updated to a silicon chip, and then addressing the build rather than doing it the other way around. 

While the solution was suitable at the time, it created additional complexity down the track to have multiple bundlers. This was the Frankenstein approach to get us through the rough patch but it offered us velocity in our development at the time.

#### How we prevented developers from testing in QA

Our team had a temptation to test in QA (an external environment) due to our poor local development workflow. 

**Some of the issues in our workflow were the following:**
- Backend and frontend engineers struggled to come up with meaningful contracts and worked on live services instead (produced by backend engineers for the frontend engineers).
- The local development environment was slow
- Some dependencies were only working in QA/Prod, but were not working locally.
- Poor data reproduced in the local environment

As mentioned in point two, our team had issues with our slow front-end build processes and this issue also resulted to the poor QA testing flow (engineers gave up using standard build processes to allow Jenkins to process the builds for them). 

I began making incremental changes to our developer ergonomics to allow for engineers to build their UI's with ease, without this constant use of npm run build. 

Below, I will document these changes under subheadings.
##### Decoupling our UI from our legacy code

We built a UI repository which utilized semantic versioning to publish our UI package, and ensured that our typing, linting, tests and components followed best practices. These components were then exported from the UI Kit repository, and imported into legacy systems.

For instance, have a look at the spaghetti code produced by AI below.

The Button component is an example of a UI imported from our UI Kit into our legacy code.

**Note the following:**
1) The legacy code is not following the best conventions.
2) The imported **Button** encapsulates the necessary business logic, but this logic is isolated away from the legacy code. 


```js
import React from 'react';
import ReactDOM from 'react-dom';
import { Button } from '@our-company/ui'

const App = () => {
  const x = 3, y = 7, z = x + y; // Random numbers
  const items = ['One', 'Two', 'Three'];

  return (
    <div>
      <h1>Messy JSX</h1>
      {items.map((item, i) => (
        <div key={i} className={i % 2 === 0 ? 'even' : 'odd'}>
          {item} - {(() => { return (i * z) + (Math.random() * 100); })()}
        </div>
      ))}
      <Button onClick={() => alert('do something amazing!'); }/>
      <footer>Footer with random number: {Math.random()}</footer>
    </div>
  );
};

ReactDOM.render(<App />, document.getElementById('root'));

```

And then our UI Kit would have something like the following:

**button/index.tsx**

```tsx
import styled from '@emotion/styled';

interface ButtonProps = {
	theme: 'dark' | 'light'
}

const StyledButton = styled.button`
	// some styling here using theme prop
`;

export const Button = (props) => {
	const { children } = props;
	return <StyledButton>{children}</StyledButton>
}
```

**src/index.ts**

```ts
export * from './button';
```

And the **package.json** is configured to point to point to **src/index.ts** as its main entry point.

By doing this, we are able to build a solid button UI component without coupling it to the existing spaghetti code.

This enables us to scale easily, continue building meaningful UI components, create storybook workflows, tests, linting and the list goes on.

As this UI Kit scaled out, it enabled us to begin creating **entire views** in our decoupled repository (by evolving it into a mono-repo) and then utilizing them in our legacy view.

For instance,

```jsx
import React from 'react';
import ReactDOM from 'react-dom';
import { TidyView } from '@our-company/views'

const App = () => {
  const items = ['One', 'Two', 'Three'];

  return <TidyView items={items}/>
};

ReactDOM.render(<App />, document.getElementById('root'))
```

Tada! And just like that we've cleaned up the legacy code to be more manageable and testable. We could isolate the tests to target TidyView, with the parameters supplied by the legacy code (to best replicate the environment). 

If you ever notice spaghetti code in your code base, try decoupling it in a separate repository (or folder) with build processes that are adopting latest standards. This will improve your velocity as a software engineer and will increase the quality of the code you produce.

##### Creating meaningful API contracts to share with front-end engineers

A fundamental way that we improved overall developer speed was enabling front-end engineers to work without needing to build against prebuild APIs.

Imagine a frontend, and a backend engineer working on the same project together.

The backend engineer may take a week, or two to build their API endpoints which are well tested and working according to the required standards.

Now imagine if the frontend engineer was coupled to the backend engineer.

For instance, they have a Todo app.  The Todo app requires the functionality to save, retrieve, or delete todos. If the backend engineer has not provided clear API contracts and they are always changing, then the frontend engineer does not have a clear idea of what to build against.

Now what if the frontend engineer waited for the backend engineer to finish their backend before they commenced their work? This creates a bottleneck, and this is what this team that I worked with experienced.

In-order to free the team from the bottleneck, I introduced a simple solution.

[**Storybook Mocks.**](https://storybook.js.org/docs/writing-stories/mocking-data-and-modules/mocking-network-requests)

While there are more mature tools out there which may assist with building better tested frontend solutions (and validate them against API contracts) such as [Pactflow](https://pactflow.io/), Storybook Mocks allowed our team to build quickly in the midst of the legacy stack without diverting the overall direction of the team.

**Consider this process**

1) The team documents their solution and begins developing their backend.
2) They come up with a clear API contract, with **GET**, **PUT**, **POST**, **DELETE** endpoints, along with their necessary URL structures.
3) The backend engineer produces sample payloads, and response mocks which the frontend engineer can utilize to develop their decoupled frontends.
4) The frontend engineer and backend engineer can now work in parallel without blocking one another.

## Dated CI/CD processes

Our CI/CD processes at the time were showing their age, and as a result they were riddled with security vulnerabilities (Jenkins extensions were out of date).

Deployments would take around 30mins each (on average), with the longest deployments taking up to an hour.

In order to get deployments into production, the deployment to staging had to be complete first. It was a direct dependency. 

The result of this was that in the case of an emergency where a hotfix needed to be shipped ASAP, we would need to wait 1hr for staging to build, and then an additional 1hr for production to be built. 

That's a total of 2 hours wait time (if the hotfix works).

Moreover, there were no tests. Code reviews were non existent too.

I strongly believe that a healthy CI/CD process is critical to development velocity and product health. If neglected, the CI/CD can become a bottleneck to engineers due to lack of bug detection & slow speed.

### Addressing the elephant in the room - no code reviews

Upon entering the team, the first change I proposed was code reviews. This was my role as a Senior Engineer after all, to support the quality of the code across the organization.

Initially, this was a very slow process to employ. The code quality was poor and software engineers were merging code without the reviews taking place. 

In order to enforce this, we enabled the minimum requirement of 2 code reviews per PR on our repositories. We also coupled this with standard branch policies such as requiring a pull request to be created for code to be merged into the main codebase.

Once we employed this changes, the amount of overall team collaboration improved. We started to have discussions about serious issues impacting our code. Such issues picked up by developers included: 
- Simple syntax issues not picked up due to lack of static analysis on our legacy systems
- Logic errors
- Poor algorithm performance
- Code smells or unclean code.
  
### Decoupling CI/CD with Github Actions

Github Actions worked wonders for our team. Through the use of Github Actions we were able to decouple our repositories from a central self-managed CI/CD platform. As mentioned, there was quite an overhead in managing the centralised Jenkins platform as a number of the plugins utilised had vulnerabilities detected. These plugins were difficult to update due to the dependent pipeline logic.

Instead, we would create reusable Github Actions that could be utilized on a per-need basis, for instance - a simple workflow that releases the code to ECS, or a workflow that triggers a central testing process (testing critical endpoints).

The beauty of Github Actions for us was the ability to be able to make quick modifications to our pipelines in a central Git repository, and also ensure each repository had unique workflows according to their needs.

For instance, ECS applications and lambdas were deployed differently, or monorepo package management vs polyrepo. 

Each Github repository could be configured quickly without the intervention of Site Reliability Engineers (SRE) for those looking to get their hands dirty.

I would recommend Github Actions to any engineers looking for a quick CI/CD solution (free for public repos), as it supports many actions to quickly install packages, clone repos, publish static assets etc. 

As a result of our changes, our deployment process timeframes were reduced substantially, improving the overall development velocity.

### Addressing testing

I believe testing is an ongoing challenge in software engineering teams, perhaps more-so in legacy blues struck teams. 

After inspecting the codebase I noticed the test command was not being utilized in the CI/CD process, and upon executing it, it lit up like a Christmas tree. 

The unit tests had regressed, simply because there was no engineer interested in maintaining them, and building them was an uphill battle.

In-order to resolve this, I did the following:
- Fixed tests which were possible to fix
- Marked the broken tests, and excluded them accordingly in the test configuration. 
- Once it was all greens, I re-integrated it in our CI/CD pipeline, now our code could not regress for the remaining tests.

Moreover, I integrated E2E tests for our CI/CD pipeline so that we could capture any regressions from a high level view. 

Since performing those really straight forward changes (nothing life changing), we had seen a large number of regressions captured by our test platform and as a result prevented our system from being impacted by developer error.

Tests are super important, if they are broken in your legacy system - fix them ASAP.

The more difficult part is encouraging other engineers to test their code well but I hope you, the reader, can build tests that cover your code and overall system functionality to keep the lights on.

## Conclusion

Overall, legacy stack blues can be really difficult to work with, and demotivating at times. But its important to stick to it, and continue pushing on through the dull and boring times. 

With the correct motivation, it WILL get better. The engineers on the team WILL evolve. And the product WILL become easier to maintain and iterate overtime.

While performing complete migrations to new systems can feel impossible, taking small steps to build new systems that can be integrated into the current system will help engineers slowly help the code "jump ship" to the other codebase. This will allow you to slowly depart from the legacy system along with its poor code practices.

With baby steps and the right motivation across the team, you will conquer the legacy stack blues and create amazing products together, emphasizing clean code craftsmanship. In turn, this will help your team grow into engineers motivated to build quality products.