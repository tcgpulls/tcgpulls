import { useTranslations } from "next-intl";

type Props = {};

const PullsPage = ({}: Props) => {
  const t = useTranslations("PullsPage");
  return <div>{t("title")}</div>;
};

export default PullsPage;
