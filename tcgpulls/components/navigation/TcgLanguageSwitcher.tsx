"use client";

import { TcgCategoryT, TcgLangT, TcgTypeT } from "@/types/Tcg";
import { Link } from "@/i18n/routing";
import { POKEMON_SUPPORTED_TCG_LANGUAGES } from "@/constants/tcg/pokemon";
import useTcgLanguage from "@/hooks/context/useTcgLanguage";
import { useTranslations } from "use-intl";

type Props = {
  tcgLang: TcgLangT;
  tcgType: TcgTypeT;
  tcgCategory: TcgCategoryT;
};

const TcgLanguageSwitcher = ({ tcgLang, tcgType, tcgCategory }: Props) => {
  const t = useTranslations();
  const { setCurrentTcgLanguage } = useTcgLanguage();

  return (
    <ul className="flex space-x-6 border-b border-zinc-700">
      {POKEMON_SUPPORTED_TCG_LANGUAGES.map((supportedLang) => {
        const isActive = tcgLang === supportedLang;
        return (
          <li key={supportedLang}>
            <Link
              onClick={() => setCurrentTcgLanguage(supportedLang)}
              href={`/app/tcg/${tcgType}/${supportedLang}/${tcgCategory}`}
              className={`
                inline-block
                py-2
                px-1
                transition-colors
                ${
                  isActive
                    ? "border-b-2 border-zinc-200 text-zinc-100 font-medium"
                    : "text-zinc-400 hover:text-zinc-200"
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
