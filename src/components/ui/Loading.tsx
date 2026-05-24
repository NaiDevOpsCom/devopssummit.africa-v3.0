import React from "react";

const Loading: React.FC = () => (
  <output className="w-full flex-grow flex flex-col items-center justify-center bg-background min-h-[calc(100vh-5rem)]">
    <div className="flex flex-col items-center gap-4 py-12">
      <div
        className="w-12 h-12 rounded-full border-4 border-primary/20 border-t-primary animate-spin"
        aria-hidden="true"
      />
      <p className="text-sm font-medium text-muted-foreground animate-pulse">
        Loading summit experience...
      </p>
    </div>
  </output>
);

export default Loading;
