// import CardsList from "@/components/tcg/CardsList";
// import { UrlParamsT } from "@/types/Params";
// import { notFound } from "next/navigation";
// import { POKEMON_CARDS_PAGE_SIZE } from "@/constants/tcg/pokemon";
// import { OrderDirection } from "@/graphql/generated";
// import { getTranslations } from "next-intl/server";
// import { useSession } from "next-auth/react";
// import { useQuery } from "@apollo/client";
// import Header from "@/components/misc/Header";
// import { GET_USER_COLLECTION_CARDS } from "@/graphql/tcg/pokemon/collection/queries";
//
// interface Props {
//   params: UrlParamsT;
// }
//
// const CollectionCardsPage = async ({ params }: Props) => {
//   const { locale, setId, tcgLang, tcgBrand, tcgCategory } = await params;
//   const { data: session, status } = useSession();
//
//   // Validate
//   if (!setId || !tcgBrand || !tcgLang) {
//     notFound();
//   }
//
//   // Ensure the user is authenticated
//   if (status === "loading") {
//     return <p>Loading...</p>;
//   }
//
//   if (status !== "authenticated") {
//     return <p>Please sign in to view your collection.</p>;
//   }
//
//   const userId = session?.user?.id;
//
//   const { data, loading, error } = useQuery(GET_USER_COLLECTION_CARDS, {
//     variables: {
//       userId,
//       setId,
//       tcgLang,
//       sortBy: "addedAt",
//       sortOrder: OrderDirection.Asc,
//       take: POKEMON_CARDS_PAGE_SIZE,
//       skip: 0,
//     },
//   });
//
//   if (loading) {
//     return <p>Loading...</p>;
//   }
//
//   if (error) {
//     return <p>Error fetching cards: {error.message}</p>;
//   }
//
//   const cards = data?.pokemonCards;
//
//   if (!cards || cards.length === 0) {
//     return <p>No cards found in your collection for this set.</p>;
//   }
//
//   const t = await getTranslations("common");
//
//   return (
//     <>
//       <Header
//         title={t(`${tcgCategory}`)}
//         size="small"
//         withBackButton
//         previousUrl={`/${locale}/app/tcg/${tcgBrand}/${tcgLang}/${tcgCategory}`}
//       />
//       <CardsList
//         key={`normalizedNumber-${OrderDirection.Asc}`}
//         initialCards={cards}
//         tcgLang={tcgLang}
//         tcgBrand={tcgBrand}
//         setId={setId}
//         sortBy="normalizedNumber"
//         sortOrder={OrderDirection.Asc}
//       />
//     </>
//   );
// };
//
// export default CollectionCardsPage;
