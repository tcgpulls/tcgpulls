import { MoonLoader } from "react-spinners";
import { CSSProperties } from "react";

type Props = {
  size?: number;
  color?: string;
  loading?: boolean;
  cssOverride?: CSSProperties;
  speedMultiplier?: number;
};

const Spinner = (props: Props) => {
  return <MoonLoader {...props} />;
};

export default Spinner;
