"use client";

import { TcgCategoryT, TcgLangT, TcgBrandT } from "@/types/Tcg";
import { Link } from "@/i18n/routing";
import { POKEMON_SUPPORTED_TCG_LANGUAGES } from "@/constants/tcg/pokemon";
import useTcgLanguage from "@/hooks/context/useTcgLanguage";
import { useTranslations } from "use-intl";

type Props = {
  tcgLang: TcgLangT;
  tcgBrand: TcgBrandT;
  tcgCategory: TcgCategoryT;
};

const TcgLanguageSwitcher = ({ tcgLang, tcgBrand, tcgCategory }: Props) => {
  const t = useTranslations();
  const { setCurrentTcgLanguage } = useTcgLanguage();

  return (
    <ul className="flex space-x-6 border-b border-primary-700">
      {POKEMON_SUPPORTED_TCG_LANGUAGES.map((supportedLang) => {
        const isActive = tcgLang === supportedLang;
        return (
          <li key={supportedLang}>
            <Link
              onClick={() => setCurrentTcgLanguage(supportedLang)}
              href={`/app/tcg/${tcgBrand}/${supportedLang}/${tcgCategory}`}
              className={`
                inline-block
                py-2
                px-1
                transition-colors
                ${
                  isActive
                    ? "border-b-2 border-primary-200 text-primary-100 font-medium"
                    : "text-primary-400 hover:text-primary-200"
                }
              `}
            >
              {t(`common.lang.${supportedLang}_label`)}
            </Link>
          </li>
        );
      })}
    </ul>
  );
};

export default TcgLanguageSwitcher;
