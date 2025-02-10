type Props = {
  code: string;
  language?: string;
};

const PtcgGoCode = ({ code, language = "en" }: Props) => {
  return (
    <div>
      <p
        className={`bg-black border border-white text-white text-[12px] font-semibold rounded-md uppercase px-1 py-0.5 whitespace-nowrap`}
      >
        <span className={`mr-0.5`}>{code}</span>
        <span className={`text-[8px]`}>{language}</span>
      </p>
    </div>
  );
};

export default PtcgGoCode;
