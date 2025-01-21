import { uniqueUsernameGenerator, Config } from "unique-username-generator";
import { KeystoneContextFromListTypeInfo } from "@keystone-6/core/types";

const generateUniqueUsername = async (
  context: KeystoneContextFromListTypeInfo<any>,
  maxAttempts = 20,
) => {
  // Configure the generator if you want a certain style
  const config: Config = {
    dictionaries: [
      // The package ships with some dictionaries, or you can provide your own
      ["cool", "fast", "lucky", "magic", "epic", "shiny", "wild"], // Adjectives
      ["tiger", "panda", "fox", "otter", "dragon", "unicorn"], // Nouns
    ],
    separator: "-",
    style: "lowerCase",
    randomDigits: 2, // e.g., "cool-fox89"
  };

  for (let i = 0; i < maxAttempts; i++) {
    // Generate the candidate username
    const candidate = uniqueUsernameGenerator(config);

    // Alternatively, you can also append random bytes for extra uniqueness:
    // const suffix = randomBytes(2).toString("hex"); // e.g. 'a5f3'
    // const candidate = uniqueUsernameGenerator(config) + suffix;

    // Check if it already exists in the database
    const existing = await context.query.User.findOne({
      where: { username: candidate },
      query: "id",
    });

    if (!existing) {
      // Found an available username, return it
      return candidate;
    }
    // Otherwise, loop again and try a new candidate
  }

  throw new Error(
    "Could not generate a unique username after multiple attempts.",
  );
};

export default generateUniqueUsername;
