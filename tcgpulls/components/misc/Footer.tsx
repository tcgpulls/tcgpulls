import { getTranslations } from "next-intl/server";
import LanguageSwitcher from "@/components/navigation/LanguageSwitcher";

const Footer = async () => {
  const t = await getTranslations("common");
  const currentYear = new Date().getFullYear();

  return (
    <footer className={`mt-8`}>
      <div className={`flex flex-col items-center justify-center gap-4`}>
        <p>
          &copy; {currentYear} {t("company")} - {t("footer.copyright")}
        </p>
        <LanguageSwitcher />
      </div>
    </footer>
  );
};

export default Footer;
