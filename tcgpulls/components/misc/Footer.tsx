import { getTranslations } from "next-intl/server";
import LanguageSwitcher from "@/components/navigation/LanguageSwitcher";

const Footer = async () => {
  const t = await getTranslations("common");
  const currentYear = new Date().getFullYear();

  return (
    <footer className={`mt-8`}>
      <div className={`flex items-center justify-center gap-8`}>
        <p className={`text-sm text-primary-400`}>
          &copy; {currentYear} {t("company")} - {t("footer.copyright")}
        </p>
        <LanguageSwitcher />
      </div>
    </footer>
  );
};

export default Footer;
