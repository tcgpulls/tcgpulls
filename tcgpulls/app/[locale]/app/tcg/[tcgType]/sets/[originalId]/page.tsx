import { UrlParamsT } from "@/types/Params";

type Props = {
  params: UrlParamsT;
};

const SetPage = async ({ params }: Props) => {
  const { originalId } = await params;

  return (
    <div>
      <h1>Set Page for {originalId}</h1>
    </div>
  );
};

export default SetPage;
