import { getTranslations } from "next-intl/server";

const Footer = async () => {
  const t = await getTranslations("common");
  const currentYear = new Date().getFullYear();

  return (
    <footer className={`mt-8`}>
      <div className={`flex items-center justify-center`}>
        <p className={`text-sm text-primary-400`}>
          &copy; {currentYear} {t("company")} - {t("footer.copyright")}
        </p>
      </div>
    </footer>
  );
};

export default Footer;
