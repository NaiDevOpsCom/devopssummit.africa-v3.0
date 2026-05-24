import React from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

/**
 * Reusable dialog that embeds the Typeform sponsorship application form.
 *
 * Usage
 * -----
 * ```tsx
 * <SponsorshipFormDialog>
 *   <button>Open form</button>
 * </SponsorshipFormDialog>
 * ```
 *
 * The Typeform URL is intentionally kept static here rather than passed as a
 * prop; if the form URL ever changes it should be updated in one place.
 * The origin (form.typeform.com) must be listed in the site's Content-Security-
 * Policy `frame-src` directive — see public/_headers.
 */
const TYPEFORM_URL = "https://form.typeform.com/to/AikBx6Vf";

interface SponsorshipFormDialogProps {
  /** The trigger element that opens the dialog when clicked. */
  children: React.ReactNode;
  /** Dialog title shown in the header bar. Defaults to "Sponsorship Form". */
  title?: string;
}

export function SponsorshipFormDialog({
  children,
  title = "Sponsorship Form",
}: SponsorshipFormDialogProps) {
  return (
    <Dialog>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="max-w-4xl h-[90vh] p-0 flex flex-col overflow-hidden">
        <DialogHeader className="p-4 border-b shrink-0">
          <DialogTitle className="font-heading">{title}</DialogTitle>
        </DialogHeader>
        <div className="flex-1 w-full">
          <iframe
            src={TYPEFORM_URL}
            className="w-full h-full border-0"
            title="Sponsorship Application Form"
          />
        </div>
      </DialogContent>
    </Dialog>
  );
}
