/* ════════════════════════════════════════════════════════════════════
   Google Places — shared loader + address parser + React hook
   ---------------------------------------------------------------------
   Uses AutocompleteService (programmatic API, available to all keys)
   instead of the deprecated Autocomplete widget which is blocked for
   API keys created after March 1 2025.
═══════════════════════════════════════════════════════════════════════ */

import { useEffect, useRef, type RefObject } from "react";

export interface ParsedPlace {
  city: string;
  district: string;
  state: string;
  pincode: string;
  country: string;
  formatted: string;
}

let loaderPromise: Promise<any> | null = null;

/** Load the Google Maps JS API (with the Places library) exactly once. */
export function loadGoogleMaps(): Promise<any> {
  if (typeof window === "undefined") return Promise.reject(new Error("no window"));
  const w = window as any;
  if (w.google?.maps?.places?.AutocompleteService) return Promise.resolve(w.google);
  if (loaderPromise) return loaderPromise;

  const key = process.env.NEXT_PUBLIC_GOOGLE_PLACES_KEY;
  loaderPromise = new Promise((resolve, reject) => {
    if (!key) { reject(new Error("Missing NEXT_PUBLIC_GOOGLE_PLACES_KEY")); return; }

    const existing = document.getElementById("gmaps-places-sdk") as HTMLScriptElement | null;
    const onReady = () => {
      if ((window as any).google?.maps?.places?.AutocompleteService) resolve((window as any).google);
      else reject(new Error("Google Maps loaded without Places library"));
    };
    if (existing) {
      if ((window as any).google?.maps?.places) { resolve((window as any).google); return; }
      existing.addEventListener("load", onReady);
      existing.addEventListener("error", () => reject(new Error("Google Maps failed to load")));
      return;
    }

    const s = document.createElement("script");
    s.id = "gmaps-places-sdk";
    s.src = `https://maps.googleapis.com/maps/api/js?key=${encodeURIComponent(key)}&libraries=places`;
    s.async = true;
    s.defer = true;
    s.onload = onReady;
    s.onerror = () => {
      loaderPromise = null; // allow retry on next call
      reject(new Error("Google Maps failed to load"));
    };
    document.head.appendChild(s);
  });
  return loaderPromise;
}

/** Pull a structured Indian address out of a Google place result. */
export function parsePlace(place: any): ParsedPlace {
  const comps: any[] = place?.address_components || [];
  const get = (type: string) => comps.find((c) => c.types?.includes(type))?.long_name || "";

  const city =
    get("locality") ||
    get("postal_town") ||
    get("administrative_area_level_3") ||
    get("sublocality_level_1") ||
    get("sublocality") ||
    get("administrative_area_level_2");

  const district = get("administrative_area_level_2") || get("administrative_area_level_3");
  const state    = get("administrative_area_level_1");
  const pincode  = get("postal_code");
  const country  = get("country");

  return { city, district, state, pincode, country, formatted: place?.formatted_address || "" };
}

/**
 * Attach Google Places autocomplete to an input element.
 * Uses AutocompleteService + a custom dropdown (compatible with all API keys,
 * including keys created after March 2025 where the Autocomplete widget is blocked).
 */
export interface PlacesTheme {
  primaryColor?: string;   // matched / typed portion of city name
  restColor?: string;      // unmatched remainder of city name
  secondaryColor?: string; // secondary text (state, country)
  hoverBg?: string;        // item hover background
  borderColor?: string;    // dropdown border
  dividerColor?: string;   // between-item divider
}

const DEFAULT_THEME: Required<PlacesTheme> = {
  primaryColor:  "#0d9488",
  restColor:     "#1f2937",
  secondaryColor:"#6b7280",
  hoverBg:       "#f0fdfa",
  borderColor:   "#e5e7eb",
  dividerColor:  "#f3f4f6",
};

const BROWN_THEME: Required<PlacesTheme> = {
  primaryColor:  "#7c2d12",              // typed portion — deep brown-maroon
  restColor:     "#9ca3af",              // remaining portion — grey
  secondaryColor:"#a78060",              // state/country line
  hoverBg:       "#fdf6ee",              // warm cream hover
  borderColor:   "rgba(185,147,69,0.35)",
  dividerColor:  "rgba(185,147,69,0.12)",
};

export { BROWN_THEME };

/** Escape HTML to prevent XSS in dynamically built dropdown HTML. */
function esc(s: string) {
  return s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
}

/**
 * Build highlighted HTML for a prediction's main text.
 * Matched substrings (typed by user) use primaryColor; the rest uses restColor.
 */
function buildHighlight(
  text: string,
  matches: Array<{ offset: number; length: number }> | undefined,
  primaryColor: string,
  restColor: string,
): string {
  if (!matches?.length) {
    return `<span style="font-weight:600;color:${primaryColor}">${esc(text)}</span>`;
  }
  let html = "";
  let pos = 0;
  for (const m of matches) {
    if (m.offset > pos) {
      html += `<span style="font-weight:600;color:${restColor}">${esc(text.slice(pos, m.offset))}</span>`;
    }
    html += `<span style="font-weight:700;color:${primaryColor}">${esc(text.slice(m.offset, m.offset + m.length))}</span>`;
    pos = m.offset + m.length;
  }
  if (pos < text.length) {
    html += `<span style="font-weight:600;color:${restColor}">${esc(text.slice(pos))}</span>`;
  }
  return html;
}

export function usePlacesAutocomplete(
  inputRef: RefObject<HTMLInputElement | null>,
  onPlace: (p: ParsedPlace) => void,
  opts?: {
    types?: string[];
    country?: string | string[];
    theme?: PlacesTheme;
    /** When set, the dropdown right edge aligns with this element's right edge (wider dropdown). */
    widthRef?: RefObject<HTMLElement | HTMLInputElement | null>;
  },
) {
  const cb = useRef(onPlace);
  cb.current = onPlace;

  const typesStr   = (opts?.types || ["geocode"]).join(",");
  const countryArr = Array.isArray(opts?.country) ? opts!.country : [opts?.country ?? "in"];
  const theme: Required<PlacesTheme> = { ...DEFAULT_THEME, ...(opts?.theme ?? {}) };
  const widthRef   = opts?.widthRef ?? null;

  useEffect(() => {
    let cancelled = false;
    const el = inputRef.current;
    if (!el) return;

    /* ── custom dropdown (replaces .pac-container) ── */
    const dropdown = document.createElement("div");
    dropdown.style.cssText = [
      "display:none", "position:absolute", "z-index:100000",
      "background:#fff", "border-radius:10px",
      "box-shadow:0 4px 24px rgba(0,0,0,0.15)",
      `border:1.5px solid ${theme.borderColor}`, "overflow:hidden",
    ].join(";");
    document.body.appendChild(dropdown);

    function positionDropdown() {
      const rect = el!.getBoundingClientRect();
      const rightEl = widthRef?.current;
      const rightEdge = rightEl ? rightEl.getBoundingClientRect().right : rect.right;
      dropdown.style.left  = rect.left + window.scrollX + "px";
      dropdown.style.top   = rect.bottom + window.scrollY + 4 + "px";
      dropdown.style.width = Math.max(rightEdge - rect.left, rect.width) + "px";
    }

    let debounceTimer: ReturnType<typeof setTimeout>;
    let svc: any        = null;
    let placesSvc: any  = null;
    let sessionToken: any = null;
    let selecting       = false; // true while we're programmatically setting a selected value

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") dropdown.style.display = "none";
    };

    const onInput = () => {
      if (selecting) return; // ignore the synthetic event fired after selection
      clearTimeout(debounceTimer);
      const val = (el as HTMLInputElement).value.trim();
      // lazy-init: if Maps loaded after this effect ran, create svc now
      if (!svc && (window as any).google?.maps?.places?.AutocompleteService) {
        svc = new (window as any).google.maps.places.AutocompleteService();
      }
      if (!val || val.length < 2 || !svc) { dropdown.style.display = "none"; return; }

      debounceTimer = setTimeout(() => {
        const g = (window as any).google;
        if (!sessionToken) sessionToken = new g.maps.places.AutocompleteSessionToken();

        svc.getPlacePredictions(
          {
            input: val,
            sessionToken,
            types: typesStr.split(","),
            componentRestrictions: { country: countryArr },
          },
          (predictions: any[], status: string) => {
            if (cancelled) return;
            dropdown.innerHTML = "";
            if (status !== "OK" || !predictions?.length) { dropdown.style.display = "none"; return; }

            positionDropdown();
            dropdown.style.display = "block";

            predictions.slice(0, 6).forEach((pred, idx) => {
              const item = document.createElement("div");
              item.style.cssText = [
                "padding:10px 14px", "cursor:pointer", "font-size:13px",
                "color:#1f2937", "line-height:1.4",
                idx < Math.min(predictions.length, 6) - 1 ? `border-bottom:1px solid ${theme.dividerColor}` : "",
              ].join(";");

              const main    = pred.structured_formatting?.main_text || pred.description;
              const sub     = pred.structured_formatting?.secondary_text || "";
              const matches = pred.structured_formatting?.main_text_matched_substrings as Array<{offset:number;length:number}> | undefined;
              item.innerHTML =
                buildHighlight(main, matches, theme.primaryColor, theme.restColor) +
                (sub ? `<br><span style="font-size:11px;color:${theme.secondaryColor}">${esc(sub)}</span>` : "");

              item.addEventListener("mouseenter", () => { item.style.background = theme.hoverBg; });
              item.addEventListener("mouseleave", () => { item.style.background = ""; });

              item.addEventListener("mousedown", (e) => {
                e.preventDefault(); // keep focus on input
                dropdown.style.display = "none";

                // Update the visible input value right away.
                // Guard with `selecting` so our onInput handler ignores this synthetic event.
                selecting = true;
                (el as HTMLInputElement).value = pred.description;
                el.dispatchEvent(new Event("input", { bubbles: true }));
                selecting = false;

                // Fetch full address_components
                if (!placesSvc) {
                  const mapDiv = document.createElement("div");
                  placesSvc = new (window as any).google.maps.places.PlacesService(mapDiv);
                }
                placesSvc.getDetails(
                  {
                    placeId: pred.place_id,
                    sessionToken,
                    fields: ["address_components", "formatted_address", "geometry", "name"],
                  },
                  (place: any, detailStatus: string) => {
                    sessionToken = null; // reset — billing optimization
                    if (detailStatus === "OK" && place) {
                      const parsed = parsePlace(place);
                      // Reverse-geocode if pincode OR district is missing
                      if ((!parsed.pincode || !parsed.district) && place.geometry?.location) {
                        const geo = new (window as any).google.maps.Geocoder();
                        geo.geocode({ location: place.geometry.location }, (results: any[], st: string) => {
                          if (st === "OK" && results?.length) {
                            for (const r of results) {
                              const comps: any[] = r.address_components || [];
                              if (!parsed.pincode) {
                                const pc = comps.find((c: any) => c.types?.includes("postal_code"));
                                if (pc) parsed.pincode = pc.long_name;
                              }
                              if (!parsed.district) {
                                const dist = comps.find((c: any) =>
                                  c.types?.includes("administrative_area_level_2") ||
                                  c.types?.includes("administrative_area_level_3")
                                );
                                if (dist) parsed.district = dist.long_name;
                              }
                              if (parsed.pincode && parsed.district) break;
                            }
                          }
                          cb.current(parsed);
                        });
                      } else {
                        cb.current(parsed);
                      }
                    } else {
                      // Graceful fallback — city from prediction text
                      cb.current({
                        city: pred.structured_formatting?.main_text || "",
                        district: "", state: "", pincode: "",
                        country: "India",
                        formatted: pred.description,
                      });
                    }
                  },
                );
              });

              dropdown.appendChild(item);
            });
          },
        );
      }, 300);
    };

    const onBlur = () => {
      setTimeout(() => { dropdown.style.display = "none"; }, 200);
    };

    el.addEventListener("keydown", onKeyDown);
    el.addEventListener("input", onInput);
    el.addEventListener("blur", onBlur);

    loadGoogleMaps()
      .then((g) => {
        if (cancelled) return;
        svc = new g.maps.places.AutocompleteService();
      })
      .catch(() => { /* key missing / offline → input still works as plain text */ });

    return () => {
      cancelled = true;
      clearTimeout(debounceTimer);
      el.removeEventListener("keydown", onKeyDown);
      el.removeEventListener("input", onInput);
      el.removeEventListener("blur", onBlur);
      try { dropdown.remove(); } catch {}
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [inputRef, typesStr, countryArr.join(",")]);
}
