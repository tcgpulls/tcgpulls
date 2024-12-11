import { ReactNode } from "react";

const PokemonLayout = ({
  children,
}: Readonly<{
  children: ReactNode;
}>) => {
  return <div>{children}</div>;
};

export default PokemonLayout;
