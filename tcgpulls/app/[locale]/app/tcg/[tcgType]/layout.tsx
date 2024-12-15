import { ReactNode } from "react";

const PokemonLayout = ({
  children,
}: Readonly<{
  children: ReactNode;
}>) => {
  return <>{children}</>;
};

export default PokemonLayout;
