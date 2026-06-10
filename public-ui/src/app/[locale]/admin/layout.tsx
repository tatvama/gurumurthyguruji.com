import type { ReactNode } from "react";

/**
 * Admin sub-layout — hides public site chrome (WhatsApp float, nav progress)
 * so the admin shell fills the viewport cleanly.
 */
export default function AdminSubLayout({ children }: { children: ReactNode }) {
  return (
    <>
      <style>{`
        /* Hide WhatsApp float (bg-[#25D366] fixed button) */
        a[href*="wa.me"],
        a[href*="whatsapp"] { display: none !important; }
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
