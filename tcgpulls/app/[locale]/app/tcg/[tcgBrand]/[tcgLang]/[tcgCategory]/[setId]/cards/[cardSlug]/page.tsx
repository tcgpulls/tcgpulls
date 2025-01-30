import { notFound } from "next/navigation";
import dynamic from "next/dynamic";
import { UrlParamsT } from "@/types/Params";
import { ComponentType } from "react";

interface Props {
  params: UrlParamsT;
}

const CardPage = async ({ params }: Props) => {
  const { tcgBrand } = await params;

  if (!tcgBrand) {
    notFound();
  }

  // Dynamically import the CardPage component based on the tcgBrand
  let TcgBrandCardPage: ComponentType<{ params: UrlParamsT }>;
  try {
    // Import the CardPage component based on the tcgBrand e.g: components/tcg/pokemon/CardPage
    // Add other brands here as needed
    TcgBrandCardPage = dynamic(
      () => import(`@/components/tcg/${tcgBrand}/CardPage`),
    );
  } catch (error) {
    console.error(`Failed to load CardPage for brand: ${tcgBrand}`, error);
    notFound(); // Render a 404 page if the brand is not found
  }

  // Render the dynamically loaded component and pass down the params
  return <TcgBrandCardPage params={params} />;
};

export default CardPage;
