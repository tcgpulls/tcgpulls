import { getTranslations } from "next-intl/server";
import { Metadata } from "next";
import { UrlParamsT } from "@/types/Params";
import { Button } from "@/components/catalyst-ui/button";
import Footer from "@/components/misc/Footer";
import LanguageSwitcher from "@/components/navigation/LanguageSwitcher";

const HomePage = async () => {
  const t = await getTranslations();

  return (
    <div className="flex flex-col justify-between min-h-screen">
      <div className="fixed top-2 right-2 sm:top-4 sm:right-4 z-10">
        <LanguageSwitcher />
      </div>

      <main className="flex-1 container mx-auto px-4 py-8 sm:py-16">
        {/* Logo Section */}
        <div className="my-16 sm:mb-24">
          <h1 className="relative text-5xl sm:text-6xl md:text-7xl font-extrabold text-accent-600 tracking-tight text-center">
            {t("common.company")}
          </h1>
        </div>

        {/* Hero Content */}
        <div className="max-w-3xl mx-auto text-center space-y-8">
          <div>
            <h2 className="text-2xl sm:text-3xl font-bold mb-4">
              {t("landing-page.title")}
            </h2>
            <p className="text-lg sm:text-xl text-primary-300 max-w-2xl mx-auto leading-relaxed">
              {t("landing-page.subtitle")}
            </p>
          </div>

          <Button href="/app">{t("landing-page.cta-button")}</Button>
        </div>

        {/* Features Section */}
        <section aria-labelledby="features-heading" className="mt-16 sm:mt-24">
          <h2 id="features-heading" className="sr-only">
            {t("landing-page.features-heading")}
          </h2>
          <div className="grid gap-6 sm:gap-8 grid-cols-1 md:grid-cols-2 relative max-w-6xl mx-auto">
            <div className="absolute inset-0 blur-3xl bg-gradient-to-br from-accent-400/10 to-primary-400/10" />
            {[
              "manage-collection",
              "track-pulls",
              "analyze-stats",
              "coming-soon",
            ].map((feature) => (
              <article
                key={feature}
                className="relative p-6 sm:p-8 rounded-xl sm:rounded-2xl border border-accent-200/50 bg-background/50 backdrop-blur-sm"
              >
                <h3 className="text-xl sm:text-2xl font-bold mb-3 sm:mb-4 text-accent-600">
                  {t(`landing-page.features.${feature}.title`)}
                </h3>
                <p className="text-base text-foreground/80 leading-relaxed">
                  {t(`landing-page.features.${feature}.description`)}
                </p>
              </article>
            ))}
          </div>
        </section>
      </main>

      <div className={`p-4`}>
        <Footer />
      </div>
    </div>
  );
};

export default HomePage;

export async function generateMetadata({
  params,
}: {
  params: UrlParamsT;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({
    locale,
    namespace: "landing-page.metadata",
  });

  return {
    title: t("title"),
    description: t("description"),
    keywords: t("keywords"),
    alternates: {
      canonical: "https://tcgpulls.xyz",
      languages: {
        en: "https://tcgpulls.xyz/en",
        ja: "https://tcgpulls.xyz/ja",
      },
    },
    openGraph: {
      title: t("og.title"),
      description: t("og.description"),
      url: "https://tcgpulls.xyz",
      siteName: t("og.site_name"),
      locale: locale,
      type: "website",
      images: [
        {
          url: "/og-image.jpg", // Make sure to create this image
          width: 1200,
          height: 630,
          alt: t("og.image_alt"),
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: t("twitter.title"),
      description: t("twitter.description"),
      images: ["/twitter-image.jpg"], // Make sure to create this image
    },
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        "max-video-preview": -1,
        "max-image-preview": "large",
        "max-snippet": -1,
      },
    },
    verification: {
      google: "your-google-verification-code", // Add your verification code
    },
  };
}
