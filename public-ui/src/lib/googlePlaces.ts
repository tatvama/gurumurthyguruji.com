/* ════════════════════════════════════════════════════════════════════
   Google Places — shared loader + address parser + React hook
   ---------------------------------------------------------------------
   One Maps-JS loader for the whole site (singleton). Any address input
   can attach autocomplete via usePlacesAutocomplete(); on selection it
   returns a structured { city, district, state, pincode, country } so
   forms can auto-fill every box from a single pick.

   Requires NEXT_PUBLIC_GOOGLE_PLACES_KEY (Maps JavaScript API + Places
   API enabled on the key).
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
  if (w.google?.maps?.places) return Promise.resolve(w.google);
  if (loaderPromise) return loaderPromise;

  const key = process.env.NEXT_PUBLIC_GOOGLE_PLACES_KEY;
  loaderPromise = new Promise((resolve, reject) => {
    if (!key) { reject(new Error("Missing NEXT_PUBLIC_GOOGLE_PLACES_KEY")); return; }

    const existing = document.getElementById("gmaps-places-sdk") as HTMLScriptElement | null;
    const onReady = () => {
      if (w.google?.maps?.places) resolve(w.google);
      else reject(new Error("Google Maps loaded without Places library"));
    };
    if (existing) { existing.addEventListener("load", onReady); existing.addEventListener("error", () => reject(new Error("Google Maps failed to load"))); return; }

    const s = document.createElement("script");
    s.id = "gmaps-places-sdk";
    s.src = `https://maps.googleapis.com/maps/api/js?key=${encodeURIComponent(key)}&libraries=places`;
    s.async = true;
    s.defer = true;
    s.onload = onReady;
    s.onerror = () => reject(new Error("Google Maps failed to load"));
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
 * On selection, `onPlace` receives the structured address.
 *
 * Keep `onPlace` referenced via a ref so re-renders don't re-bind the widget.
 */
export function usePlacesAutocomplete(
  inputRef: RefObject<HTMLInputElement | null>,
  onPlace: (p: ParsedPlace) => void,
  opts?: { types?: string[]; country?: string | string[] },
) {
  const cb = useRef(onPlace);
  cb.current = onPlace;
  const types = opts?.types ? opts.types.join("|") : "geocode";
  const country = Array.isArray(opts?.country) ? opts!.country.join(",") : (opts?.country ?? "in");

  useEffect(() => {
    let cancelled = false;
    let listener: any = null;
    const el = inputRef.current;
    if (!el) return;

    // Stop Enter from submitting the surrounding form while the dropdown is open
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Enter" && document.querySelector(".pac-container")) e.preventDefault();
    };
    el.addEventListener("keydown", onKeyDown);

    loadGoogleMaps()
      .then((g) => {
        if (cancelled || !inputRef.current) return;
        const ac = new g.maps.places.Autocomplete(inputRef.current, {
          fields: ["address_components", "formatted_address", "geometry", "name"],
          types: types.split("|"),
          componentRestrictions: country ? { country: country.split(",") } : undefined,
        });
        listener = ac.addListener("place_changed", () => {
          const place = ac.getPlace();
          const parsed = parsePlace(place);

          // City-level picks rarely include postal_code; fall back to reverse geocode
          if (!parsed.pincode && place.geometry?.location) {
            const geocoder = new g.maps.Geocoder();
            geocoder.geocode({ location: place.geometry.location }, (results: any[], status: string) => {
              if (status === "OK" && results?.length) {
                for (const result of results) {
                  const pc = result.address_components?.find((c: any) => c.types?.includes("postal_code"));
                  if (pc) { parsed.pincode = pc.long_name; break; }
                }
              }
              cb.current(parsed);
            });
          } else {
            cb.current(parsed);
          }
        });
      })
      .catch(() => { /* key missing / offline → input still works as plain text */ });

    return () => {
      cancelled = true;
      el.removeEventListener("keydown", onKeyDown);
      if (listener && (window as any).google?.maps?.event) {
        (window as any).google.maps.event.removeListener(listener);
      }
    };
  }, [inputRef, types, country]);
}
