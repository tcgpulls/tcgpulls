import PageHeader from "@/components/misc/PageHeader";
import { UrlParamsT } from "@/types/Params";
import { notFound } from "next/navigation";
import { getCard } from "@/actions/getCard";
import Image from "next/image";
import { assetsUrl } from "@/utils/assetsUrl";

interface Props {
  params: UrlParamsT;
}

const CardPage = async ({ params }: Props) => {
  const { cardId, tcgLang, tcgBrand } = await params;

  if (!cardId || !tcgBrand || !tcgLang) {
    notFound();
  }

  // Fetch the set information using the getSet action
  const card = await getCard({ tcgBrand, tcgLang, cardId });

  if (!card) {
    notFound();
  }

  return (
    <>
      <PageHeader title={`${card.name} (${card.cardId})`} />
      <Image
        src={
          card.localImageLarge
            ? assetsUrl(card.localImageLarge)
            : card.imagesLarge
        }
        className="w-full max-w-[420px] object-contain mb-4 rounded-xl"
        alt={`${card.name} card`}
        width={420}
        height={586}
      />
    </>
  );
};

export default CardPage;
