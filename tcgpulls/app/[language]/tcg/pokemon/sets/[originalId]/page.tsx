type Props = {};

const SetPage = ({
  params,
}: {
  params: { language: string; originalId: string };
}) => {
  const { language, originalId } = params;

  return (
    <div>
      <h1>Set Page</h1>
      <p>Language: {language}</p>
      <p>Set ID: {originalId}</p>
    </div>
  );
};

export default SetPage;
