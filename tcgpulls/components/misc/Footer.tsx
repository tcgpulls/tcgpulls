import { Text } from "@/components/catalyst-ui/text";
import { getTranslations } from "next-intl/server";

const Footer = async () => {
  const t = await getTranslations("common");
  const currentYear = new Date().getFullYear();

  return (
    <footer className={`mt-8`}>
      <Text className={`text-center`}>
        &copy; {currentYear} {t("company")} - {t("footer.copyright")}
      </Text>
    </footer>
  );
};

export default Footer;
