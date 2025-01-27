import { MoonLoader } from "react-spinners";
import { CSSProperties } from "react";

type Props = {
  size?: number;
  color?: string;
  loading?: boolean;
  cssOverride?: CSSProperties;
  speedMultiplier?: number;
};

const Spinner = ({
  size = 20,
  color = "#fff",
  loading = true,
  cssOverride = {},
  speedMultiplier = 1,
  ...props
}: Props) => {
  return (
    <MoonLoader
      size={size}
      color={color}
      loading={loading}
      cssOverride={cssOverride}
      speedMultiplier={speedMultiplier}
      {...props}
    />
  );
};

export default Spinner;
