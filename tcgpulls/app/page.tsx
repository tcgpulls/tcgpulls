import { Metadata } from "next";

export const metadata: Metadata = {
  title: `Home - ${process.env.NEXT_PUBLIC_APP_NAME}`,
  description: "Get your TCG pack pulls and pull rates all in one place!",
};

const AppPage = async () => {
  return (
    <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1>Loading...</h1>
    </main>
  );
};

export default AppPage;
