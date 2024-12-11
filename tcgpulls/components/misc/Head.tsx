import i18n from "@/messages/i18n";

type Props = {};

const CustomHead = ({}: Props) => {
  return (
    <head>
      {/* Font */}
      <link rel="stylesheet" href="https://rsms.me/inter/inter.css" />

      {/* Alternate language links */}
      {i18n.locales.map(({ value }) => (
        <link
          key={value}
          rel="alternate"
          hrefLang={value}
          href={`${process.env.NEXT_PUBLIC_BASE_URL}/${value}`}
        />
      ))}
      <link
        rel="alternate"
        hrefLang="x-default"
        href={`${process.env.NEXT_PUBLIC_BASE_URL}/${i18n.defaultLocale}`}
      />
    </head>
  );
};

export default CustomHead;
