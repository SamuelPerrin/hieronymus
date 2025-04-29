import React, { forwardRef } from "react";
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

const LinkComponent = forwardRef<HTMLAnchorElement, {
  to?: string;
  href?: string;
  children: React.ReactNode;
  className?: string;
  onClick?: () => void;
  target?: string;
}>(({ to, href, children, className = "", onClick, target = "" }, ref) => {
  const finalHref = to || href || "#";
  const external = isExternalLink(finalHref);

  return external ? (
    <a 
      href={finalHref} 
      onClick={onClick} 
      className={`${className} external-link`.trim()}
      ref={ref}
      target={target}
      rel={target === "_blank" ? "noopener noreferrer" : undefined}
    >
      {children}
      <ExternalLink 
        size={12} 
        style={{
          display: "inline-block", 
          marginLeft: "4px", 
          verticalAlign: "super"
        }} 
      />
    </a>
  ) : (
    <Link 
      href={finalHref} 
      onClick={onClick} 
      className={`${className} internal-link`.trim()} 
      ref={ref}
      target={target}
    >
      {children}
    </Link>
  );
});

export default LinkComponent;