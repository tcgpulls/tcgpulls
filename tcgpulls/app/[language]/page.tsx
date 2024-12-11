import { Metadata } from "next";

type Props = {
  params: {
    language: string;
  };
};

export const metadata: Metadata = {
  title: `Home -  ${process.env.NEXT_PUBLIC_APP_NAME}`,
  description: "Get your TCG pack pulls and pull rates all in one place!",
};

const HomePage = ({ params }: Props) => {
  return <div>Welcome to the {params.language} home page!</div>;
};

export default HomePage;
