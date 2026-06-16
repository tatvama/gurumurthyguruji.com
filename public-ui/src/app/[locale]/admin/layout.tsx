import type { ReactNode } from "react";

/**
 * Admin sub-layout — hides public site chrome (WhatsApp float, nav progress)
 * so the admin shell fills the viewport cleanly.
 */
export default function AdminSubLayout({ children }: { children: ReactNode }) {
  return (
    <>
      <style>{`
        /* Hide WhatsApp float (bg-[#25D366] fixed button) only —
           scoped by its aria-label so in-panel WhatsApp links still render */
        a[aria-label="Message Guruji's seva team on WhatsApp"] { display: none !important; }
        /* Hide nav progress bar */
        [role="progressbar"],
        #nprogress { display: none !important; }
        /* Reset body for full-screen admin */
        body {
          overflow: hidden !important;
          background: #f5f5f5 !important;
          display: block !important;
          min-height: unset !important;
        }
      `}</style>
      {children}
    </>
  );
}
