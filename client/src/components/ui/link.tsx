import { Link } from "wouter";
import { ExternalLink } from "lucide-react";

const isExternalLink = (url: string) => {
  try {
    const linkUrl = new URL(url, window.location.origin);
    return linkUrl.origin !== window.location.origin;
  } catch {
    return false;
  }
};

export const LinkComponent = ({
  to,
  href,
  children,
  className = "",
}: {
  to?: string;
  href?: string;
  children: React.ReactNode;
  className?: string;
}) => {
  const finalHref = to || href || "#";
  const external = isExternalLink(finalHref);
  return (
    <Link href={finalHref} className={`${className} ${external ? "external-link" : "internal-link"}`.trim()}>
      {children}
      {external && (
        <ExternalLink size={12} style={{display:"inline-block", marginLeft: "4px", verticalAlign: "super"}} />
      )}
    </Link>
  );
};

export default LinkComponent;