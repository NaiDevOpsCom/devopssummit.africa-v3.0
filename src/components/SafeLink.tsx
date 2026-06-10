import * as React from "react";
import { sanitizeUrl } from "../utils/sanitize";
import { AnchorHTMLAttributes } from "react";

interface SafeLinkProps extends AnchorHTMLAttributes<HTMLAnchorElement> {
  href: string;
}

/**
 * Drop-in replacement for <a> tags.
 * Blocks javascript:, data:, and other dangerous protocols.
 */
export const SafeLink = ({ href, children, ...props }: SafeLinkProps) => {
  const safeHref = sanitizeUrl(href);

  const isExternal = React.useMemo(() => {
    try {
      if (!safeHref.startsWith("http")) return false;
      const url = new URL(safeHref);
      return url.origin !== globalThis.location.origin;
    } catch {
      return false;
    }
  }, [safeHref]);

  return (
    <a
      href={safeHref}
      {...props}
      {...(isExternal && {
        target: "_blank",
        rel: "noopener noreferrer",
      })}
    >
      {children}
      {isExternal && <span className="sr-only"> (opens in a new tab)</span>}
    </a>
  );
};
