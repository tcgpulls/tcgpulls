// components/CustomLink.tsx
import React from "react";
import Link, { LinkProps } from "next/link";

interface CustomLinkProps extends LinkProps {
  className?: string; // Optional: Additional CSS classes
  children: React.ReactNode; // Required: Content of the link
}

const CustomLink: React.FC<CustomLinkProps> = ({
  href,
  className,
  children,
  ...props
}) => {
  return (
    <Link href={href} className={className} {...props}>
      {children}
    </Link>
  );
};

export default CustomLink;
