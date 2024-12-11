import { Metadata } from "next";
import { Link } from "@/components/catalyst-ui/link";
import Card from "@/components/misc/Card";

export const metadata: Metadata = {
  title: "TCG - TCGPulls",
  description: "Get your TCG pack pulls and pull rates all in one place!",
};

type Props = {};

const TCGPage = async ({}: Props) => {
  return (
    <>
      <Link href={`/tcg/pokemon/sets`}>
        <Card isClickable={true}>
          <p>Pokemon TCG</p>
        </Card>
      </Link>
    </>
  );
};

export default TCGPage;
