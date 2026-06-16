import type { ReactNode } from "react";

/**
 * PDF sub-layout — overrides the admin layout's `overflow: hidden` so the
 * print preview page can scroll freely on screen.
 */
export default function PdfSubLayout({ children }: { children: ReactNode }) {
  return (
    <>
      <style>{`
        body {
          overflow: auto !important;
          background: #555 !important;
          min-height: 100vh !important;
        }
        @media print {
          body {
            background: #fff !important;
          }
        }
      `}</style>
      {children}
    </>
  );
}
