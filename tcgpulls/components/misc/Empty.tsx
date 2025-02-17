import { Link } from "@/i18n/routing";
import { Button } from "@/components/catalyst-ui/button";

type Props = {
  title: string;
  description?: string;
  ctaText?: string;
  ctaUrl?: string;
  ctaOnClick?: () => void;
};

const Empty = ({ title, description, ctaText, ctaUrl, ctaOnClick }: Props) => {
  return (
    <div className={`h-full flex justify-center items-center rounded-xl`}>
      <div className={`flex gap-4 items-center p-36`}>
        {(ctaUrl || ctaOnClick) && (
          <>
            {ctaUrl && <Link href={ctaUrl}>{ctaText}</Link>}
            <Button color={`primary`} onClick={ctaOnClick}>
              {ctaText}
            </Button>
          </>
        )}
        <p className={`font-semibold`}>{title}</p>
        {description && <p>{description}</p>}
      </div>
    </div>
  );
};

export default Empty;
