import i18n from "@/i18n/i18n";
import Head from "next/head";

const baseUrl = process.env.NEXT_PUBLIC_BASE_URL;

const CustomHead = () => {
  return (
    <Head>
      {/* Font */}
      <link rel="stylesheet" href="https://rsms.me/inter/inter.css" />

      {/* Alternate language links */}
      <link
        rel="alternate"
        hrefLang="x-default"
        href={`${baseUrl}/${i18n.defaultLocale}`}
      />
      {i18n.locales.map(({ value }) => (
        <link
          key={value}
          rel="alternate"
          hrefLang={value}
          href={`${baseUrl}/${value}`}
        />
      ))}
    </Head>
  );
};

export default CustomHead;
