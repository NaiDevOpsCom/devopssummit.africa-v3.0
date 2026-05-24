import { useRouteError } from "react-router-dom";
import { IS_DEVELOPMENT } from "@/config/env";
import Seo from "@/components/SEO";

export function RouteError() {
  const error = useRouteError() as Error;

  return (
    <div className="flex min-h-screen items-center justify-center bg-background">
      <Seo title="Error" description="An unexpected error occurred." noIndex />
      <div role="alert" className="flex flex-col items-center justify-center p-6 text-center">
        <h2 className="text-2xl font-bold text-foreground mb-4">Something went wrong</h2>
        <p className="text-muted-foreground mb-8 max-w-md">
          There was an unexpected error loading this page.
          {IS_DEVELOPMENT && error && (
            <span className="block mt-2 text-xs font-mono opacity-60">
              {error.message || String(error)}
            </span>
          )}
        </p>
        <a
          href="/"
          className="px-6 py-2 bg-primary text-primary-foreground rounded-lg hover:opacity-90 transition-opacity"
        >
          Return to Home
        </a>
      </div>
    </div>
  );
}
