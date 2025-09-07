import { DogSchema } from './schemas';

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
    weight: -10  // invalid
};

validateDog(dogInput);