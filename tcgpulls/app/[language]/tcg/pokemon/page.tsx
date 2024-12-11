import { Metadata } from "next";
import { Link } from "@/components/catalyst-ui/link";
import Card from "@/components/misc/Card";

export const metadata: Metadata = {
  title: "Pokemon TCG - TCGPulls",
  description:
    "Get your Pokemon TCG pack pulls and pull rates all in one place!",
};

type Props = {};

const PokemonPage = async ({}: Props) => {
  return (
    <>
      <Link href={`/tcg/pokemon/sets`}>
        <Card isClickable={true}>
          <p>Pokemon Pokemon</p>
        </Card>
      </Link>
    </>
  );
};

export default PokemonPage;
