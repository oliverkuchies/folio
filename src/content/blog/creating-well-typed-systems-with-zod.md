---
title: Creating well typed systems with Zod
publishDate: 2025-09-06 14:24:00
img: /assets/og/creating-well-typed-systems-with-zod.png
description: | 
  Typescript offers endless opportunities to build typesafe systems for the web. Zod makes it 10x better.

tags:
  - Typescript
  - Zod
  - Front End Development
  - Back End Development
---

## What is Zod?

<a href="https://zod.dev" target="_blank">Zod</a> is a library written for Typescript developers that allows for schema building, validation and parsing of data structures. It also offers inference of schemas to retrieve their types.

## Why should I use Zod?

Zod is a simple library to use that offers extensive customisability.

Here are a few scenarios in which you may choose to utilise Zod:

- You want to ensure payloads sent and retrieved from RESTful endpoints are validated, typed and parsable.
- You want to create a schema library to share between microservices.
- You want to transform other data structures utilised in your application into well-typed data.

Have a think about different applications in which this library may come in handy in your development process.

In my case, I was finding it difficult to validate payloads to and from RESTful endpoints across microservices.

Using Zod allowed me to share schemas across my applications to ensure that payloads were validated on a TS level.

While some forms of transport such as GraphQL, tRPC or gRPC offer type infererence, RESTful endpoints generally do not offer this.

Zod enables meaningful schemas to be built to validate these payloads and responses.

Moreover, services such as SQS require raw payloads to be constructed and delivered from producers and eventually received by consumers. 

These services generally do not offer inference and Zod allows the payloads to and from the queue to be validated.
## How to validate API responses with Zod

Lets start with a simple example. The local pet shop wants to create a RESTful endpoint that returns the list of the dogs available in the shop along with their prices.

Requests will be made to the endpoint with:

```GET /v1/dogs```

The data delivered from the endpoint will follow the following structure:

| Field      | Description                | Type              | Optional |
|------------|---------------------------|-------------------|----------|
| breed      | The breed of the dog      | string            | No       |
| color      | The color of the dog      | string            | No       |
| price      | The price of the dog      | float (number)    | No       |
| weight     | The weight of the dog
  

When an error occurs, the engineer wants to return the following response:

- **error**: A description of what caused the application to fail to deliver dogs.

- **code**: The status code.

With this information, we can begin building a meaningful Zod schema.

In order to do this, we need to import Zod into our application.

```ts
import * as z from "zod";
```

Once Zod is imported, we can begin using it.

Let's create a simple fetch request to simulate this use case.

We can also add a really basic interface which we can use to assign a type to our JSON response (we will remove this soon).

```ts
import * as z from "zod";

interface Dog {
    breed: string;
    color: string;
    price: number;
    weight?: number;
}

interface ErrorResponse {
    error: string;
    code: number;
}

async function getDogs() {
    const res = await fetch('/v1/dogs');
    const json = await res.json();

    if (!res.ok) {
        return json as ErrorResponse;
    }

    return json as Dog[];
}

```

In the code above, we are using an interface, and typecasting our JSON response without validating it.

We simply expect it to either be an ErrorResponse on failure, or an array of Dogs on success.

**Let's clean this code up with Zod.**
  
Instead of producing an interface, let's create a schema in Zod, and use type inference to retrieve the appropriate type definition.

For instance, to create our schema, we write the following:

```ts
const DogSchema = z.object({
    breed: z.string(),
    color: z.string(),
    price: z.number(),
    weight: z.number().optional()
})

const DogsSchema = DogSchema.array();

const ErrorSchema = z.object({
    error: z.string(),
    code: z.number()
});

const DogResponseSchema = DogsSchema.or(ErrorSchema);

```

**Note:** `.optional()` is used to create a `type | undefined` definition, for instance, in this case the weight is `number | undefined`.

Wonderful! Now that we have our schema, we can begin inferring types and validating the API server response.

To validate our API response, we need to utilise `DogsSchema.parse()` or `DogsSchema.safeParse()`.

`parse` will throw an exception (ZodError) upon failed parse, while `safeParse` will allow failure without an error. 

`safeParse` allows users to handle errors without a try catch.

In our case, we want the API to strictly comply with our schema specifications.

We are not sending any data, we are requesting data which means that if the data fails to meet our schema we can safely assume one of the following scenarios:
- The developer changed the backend response without giving us notice
- A fault has occurred on the server end, resulting in data returning incorrectly
- Our schema is invalid, and needs to be adjusted.

In all of the cases above, our application should immediately throw an error and be captured by our observability platform (whether it be Sentry, Datadog etc) so that developers can rectify the issue. We should ensure our application has an error boundary at the top level so it can capture this exception.

Let's apply the schema to our response from the API server. We can organize these schemas in a file called schemas.ts. 

**schemas.ts**
```ts
import * as z from "zod";
import { DogResponseSchema } from './schemas';

const DogSchema = z.object({
    breed: z.string(),
    color: z.string(),
    price: z.number(),
    weight: z.number().optional()
})

const DogsSchema = DogSchema.array();

const ErrorSchema = z.object({
    error: z.string(),
    code: z.number()
});

export const DogResponseSchema = DogsSchema.or(ErrorSchema);
```

**index.ts**

```ts
import * as z from "zod";
import { DogResponseSchema } from './schemas';

async function getDogs() {
    const res = await fetch('/v1/dogs');
    const json = await res.json();
    return DogResponseSchema.parse(json);
}

```

Congratulations, you have successfully created your first Zod based response validation system!

This method should automatically infer the type of the schema, but if you wish to infer it yourself you can utilize the `infer` method.

For instance:
`export type DogResponseSchemaType = z.infer<typeof DogResponseSchema>`

## How to validate API payloads with Zod
While the section above highlights how responses received from the backend can be parsed with Zod, it is also recommended to validate user payloads sent to the server. This can (and should) be validated in both the front-end, and back-end of the application.

With this in mind, Zod is able to validate more than just field types - it also supports other usages such as minimum or maximum field lengths.

Let's create another scenario. The pet shop is looking to allow store employees to add new dogs to the website.

Requests will be made to the endpoint with:

```POST /v1/dogs```

The data delivered to the endpoint will follow the same structure as the retrieved response, but we're going to improve our schemas by adding field length validation. We will also export our DogSchema as an inferred type.

Let's update our schemas to have minimum and maximum lengths.

**schemas.ts**
```ts
import * as z from "zod";

const DogSchema = z.object({
    breed: z.string().min(3).max(30),
    color: z.string().min(3).max(20),
    price: z.number().min(0),
    weight: z.number().min(0).optional()
})

export type DogSchemaType = z.infer<typeof DogSchema>;

const DogsSchema = DogSchema.array();

const ErrorSchema = z.object({
    error: z.string(),
    code: z.number()
});

export const DogResponseSchema = DogsSchema.or(ErrorSchema);
```

Great, now lets use these in our POST payload.

**index.ts**

```ts
import * as z from "zod";
import { DogResponseSchema, DogSchemaType } from './schemas';

async function addDog(dog : DogSchemaType) {
    const res = await fetch('/v1/dogs', {
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(dog)
    });
    const json = await res.json();
    return DogResponseSchema.parse(json);
}

```

In this case, if our application is poorly passing the dog object, we can validate it.

Perhaps we have a user submitting a form, but we've poorly encapsulated the contents of the form into the dog parameter.

Or perhaps our form level validation isn't handling particular items well enough such as field length.

In these cases above, Zod will throw an exception which will allow the engineer to correct the issue at hand.

Moreover, the exception can be handled at a form level by using `safeParse`.

For instance, 
```ts
function validateDog(dog: unknown) {
    const result = DogSchema.safeParse(dog);

    if (!result.success) {
        result.error.issues.forEach((err) => {
            console.error(`Field: ${err.path.join('.')}, Issue: ${err.message}`);
        });
        return false;
    }

    return true;
}

const dogInput = {
    breed: "La", // too short
    color: "",   // too short
    price: -10,  // invalid
    weight: -1  // invalid
};

validateDog(dogInput);
```

Here the errors are presented in the console, but this can be modified to add errors to the user's form fields and block their submission.

The `result.error.issues` property allows a simple loop through the errors, and allows the retrieval of field name property (err.path with simple manipulation) and err.message.

Here is the sample error returned as a result of the validation above:

```
Field: breed, Issue: String must contain at least 3 character(s)
Field: color, Issue: String must contain at least 3 character(s)
Field: price, Issue: Number must be greater than or equal to 0
Field: weight, Issue: Number must be greater than or equal to 0
```

What are you waiting for? Start using <a href="https://zod.dev" target="_blank">Zod</a> today!