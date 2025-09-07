import * as z from "zod";

export const DogSchema = z.object({
    breed: z.string().min(3).max(30),
    color: z.string().min(3).max(20),
    price: z.number().min(0),
    weight: z.number().optional()
})

export type DogSchemaType = z.infer<typeof DogSchema>;

const DogsSchema = DogSchema.array();

const ErrorSchema = z.object({
    error: z.string(),
    code: z.number()
});

export const DogResponseSchema = DogsSchema.or(ErrorSchema);