import { useTranslations } from "next-intl";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "TCGPulls - Pulls",
  description: "Get your TCG pack pulls and pull rates all in one place!",
};

type Props = {};

const PullsPage = ({}: Props) => {
  const t = useTranslations("PullsPage");
  return <div>{t("title")}</div>;
};

export default PullsPage;
