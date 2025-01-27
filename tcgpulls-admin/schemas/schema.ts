// Welcome to your schema
//   Schema driven development is Keystone's modus operandi
//
// This file is where we define the lists, fields and hooks for our data.
// If you want to learn more about how lists are configured, please read
// - https://keystonejs.com/docs/config/lists

// see https://keystonejs.com/docs/fields/overview for the full list of fields
//   this is a few common fields for an example

// when using Typescript, you can refine your types to a stricter subset by importing
// the generated types from '.keystone/types'
import cmsLists from "./cms";
import authJsLists from "./authjs";
import tcgPokemonLists from "./tcg/pokemon";

const lists = {
  ...tcgPokemonLists,
  ...authJsLists,
  ...cmsLists,
};

export default lists;
