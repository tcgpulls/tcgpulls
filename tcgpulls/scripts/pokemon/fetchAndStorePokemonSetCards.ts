import { fetchPokemonTcgApiSetCards } from "@/lib/PokemonTcgApi/fetchPokemonTcgApiSetCards";
import customLog from "@/utils/customLog";
import { prisma } from "@/lib/prisma";

// Parse command line arguments
const args = process.argv.slice(2);
const force = args.includes("--force");
const setIdArg = args.find((arg) => arg.startsWith("--setId="));
const cardIdArg = args.find((arg) => arg.startsWith("--cardId="));
const specifiedSetId = setIdArg ? setIdArg.split("=")[1] : null;
const specifiedCardId = cardIdArg ? cardIdArg.split("=")[1] : null;

async function fetchAndStorePokemonSetCards() {
  let totalSetsProcessed = 0;
  let totalCardsInserted = 0;
  let totalCardsSkipped = 0;

  try {
    let sets = await prisma.pokemonSet.findMany();
    customLog(`🔍 Found ${sets.length} sets in the database.`);

    // Filter sets if a specific setId is provided
    if (specifiedSetId) {
      sets = sets.filter((s) => s.originalId === specifiedSetId);
      if (sets.length === 0) {
        customLog(
          "warn",
          `⚠️ No sets found matching specified setId: ${specifiedSetId}`,
        );
      } else {
        customLog(`🎯 Processing only specified set: ${specifiedSetId}`);
      }
    }

    for (const set of sets) {
      customLog(
        `🚀 Processing set: ${set.name} (Original ID: ${set.originalId})`,
      );

      let cardsData;
      try {
        cardsData = await fetchPokemonTcgApiSetCards("en", set.originalId);
        if (!Array.isArray(cardsData)) {
          customLog(
            "warn",
            `⚠️ No cards data returned for set: ${set.originalId}`,
          );
          continue;
        }
      } catch (error) {
        customLog(
          "error",
          `❌ Failed to fetch cards for set ${set.originalId}`,
          error,
        );
        continue;
      }

      // Filter cards if a specific cardId is provided
      if (specifiedCardId) {
        cardsData = cardsData.filter(
          (card: any) => card.id === specifiedCardId,
        );
        if (cardsData.length === 0) {
          customLog(
            "warn",
            `⚠️ No cards found matching specified cardId: ${specifiedCardId}`,
          );
        } else {
          customLog(`🎯 Processing only specified card: ${specifiedCardId}`);
        }
      }

      for (const card of cardsData) {
        const hp =
          card.hp && !isNaN(parseInt(card.hp)) ? parseInt(card.hp) : null;
        const convertedRetreatCost = card.convertedRetreatCost ?? null;

        const baseCardData = {
          setId: set.id,
          originalId: card.id,
          name: card.name,
          supertype: card.supertype,
          subtypes: card.subtypes || [],
          hp,
          types: card.types || [],
          evolvesFrom: card.evolvesFrom || null,
          flavorText: card.flavorText || null,
          number: card.number,
          artist: card.artist || null,
          rarity: card.rarity || null,
          nationalPokedexNumbers: card.nationalPokedexNumbers || [],
          imagesSmall: card.images?.small || "",
          imagesLarge: card.images?.large || "",
          retreatCost: card.retreatCost || [],
          convertedRetreatCost: convertedRetreatCost,
        };

        const variantKeys = card.tcgplayer?.prices
          ? Object.keys(card.tcgplayer.prices)
          : [];
        const allVariants = [
          "normal",
          ...variantKeys.filter((k) => k !== "normal"),
        ];

        for (const variantKey of allVariants) {
          try {
            // Check if card already exists
            const existingCard = await prisma.pokemonCard.findUnique({
              where: {
                setId_originalId_variant: {
                  setId: set.id,
                  originalId: card.id,
                  variant: variantKey,
                },
              },
            });

            if (existingCard && !force) {
              customLog(
                `⏭️ Skipping existing card: ${card.name} (${card.id} - ${variantKey}) in set: ${set.name}`,
              );
              totalCardsSkipped++;
              continue;
            }

            // Force overwrite: delete existing relations
            if (force && existingCard) {
              await prisma.pokemonCardAbility.deleteMany({
                where: { cardId: existingCard.id },
              });
              await prisma.pokemonCardAttack.deleteMany({
                where: { cardId: existingCard.id },
              });
              await prisma.pokemonCardWeakness.deleteMany({
                where: { cardId: existingCard.id },
              });
            }

            const abilitiesData = (card.abilities || []).map(
              (ability: any) => ({
                name: ability.name,
                text: ability.text,
                type: ability.type,
              }),
            );

            const attacksData = (card.attacks || []).map((attack: any) => ({
              name: attack.name,
              cost: attack.cost || [],
              convertedEnergyCost: attack.convertedEnergyCost,
              damage: attack.damage || null,
              text: attack.text || null,
            }));

            const weaknessesData = (card.weaknesses || []).map(
              (weakness: any) => ({
                type: weakness.type,
                value: weakness.value,
              }),
            );

            // Insert or update card
            const upsertedCard = await prisma.pokemonCard.upsert({
              where: {
                setId_originalId_variant: {
                  setId: set.id,
                  originalId: card.id,
                  variant: variantKey,
                },
              },
              update: {
                ...baseCardData,
                variant: variantKey,
                abilities: { create: abilitiesData },
                attacks: { create: attacksData },
                weaknesses: { create: weaknessesData },
              },
              create: {
                ...baseCardData,
                variant: variantKey,
                abilities: { create: abilitiesData },
                attacks: { create: attacksData },
                weaknesses: { create: weaknessesData },
              },
            });

            customLog(
              `✅ Upserted card: ${set.name} - ${upsertedCard.name} (${variantKey})`,
            );
            totalCardsInserted++;
          } catch (insertError) {
            customLog(
              "error",
              `❌ Error inserting card: ${set.name} - ${card.name} (${variantKey}) (id: ${card.id})`,
              insertError,
            );
          }
        }
      }

      totalSetsProcessed++;
      customLog(`🎯 Finished processing set: ${set.name} (${set.originalId})`);
    }

    // Summary Log
    customLog("\n--- Card Insertion Summary ---");
    customLog(`✅ Total Sets Processed: ${totalSetsProcessed}`);
    customLog(`✅ Total Cards Inserted: ${totalCardsInserted}`);
    customLog(`⏭️ Total Cards Skipped: ${totalCardsSkipped}`);
  } catch (error) {
    customLog("error", "❌ Error during fetching and storing cards", error);
  } finally {
    await prisma.$disconnect();
  }
}

fetchAndStorePokemonSetCards().catch((error) => {
  customLog("error", "❌ Error in fetchAndStorePokemonSetCards script:", error);
  process.exit(1);
});
