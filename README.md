# Rojino backend

A tiny search backend so the app shows **real** shop results instead of sample
data. The app calls `GET /search?q=<text>` and expects JSON:

```json
[
  { "retailer": "دیجی‌کالا", "priceToman": 268000, "rating": 4.7,
    "ratingCount": 940, "url": "https://...", "imageURL": "https://... or null" }
]
```

## Run locally

```bash
pnpm install
pnpm build
pnpm start                # provider = digikala (default)
PROVIDER=torob pnpm start # provider = Torob aggregator (real data, unofficial)
PROVIDER=mock pnpm start  # provider = mock (Iranian-shop search deep links)

# Development with hot reload:
pnpm dev

# Tests:
pnpm test
pnpm test:coverage
```

Test: open `http://localhost:3000/search?q=رژ لب mac`

## Connect the app

In `Rojino/Models/BackendConfig.swift` set:

```swift
static let baseURL = "https://your-deployed-backend"
```

The app automatically switches from mock to real results when this is non-empty.

## Local development with the iOS app (localhost)

1. Start the server:
   ```bash
   pnpm install
   pnpm dev             # or: pnpm build && pnpm start
   ```
   Confirm in a browser: `http://localhost:3000/health`

2. Point the app at it (`Rojino/Models/BackendConfig.swift`):
   - **Simulator:** `static let baseURL = "http://localhost:3000"` (already set).
   - **Real iPhone:** localhost won't reach your Mac. Use the Mac's LAN IP and
     keep both on the same Wi-Fi, e.g. `"http://192.168.1.20:3000"`.
     Find the IP: System Settings ▸ Wi-Fi ▸ Details ▸ IP Address.

3. **Allow HTTP to the local server (required).** iOS blocks plain HTTP by
   default (App Transport Security). For dev, add an exception in Xcode:
   Target ▸ **Info** ▸ add key **App Transport Security Settings** →
   inside it add **Allow Local Networking = YES**
   (raw keys: `NSAppTransportSecurity` → `NSAllowsLocalNetworking = YES`).
   This permits localhost / LAN HTTP without disabling ATS globally. Remove it
   (and use HTTPS) for production.

4. Reach the results screen: Camera tab → swipe up (or tap the handle) → خرید
   آنلاین. You'll see live results coming from your local server.
   - Tip: the camera itself needs a real device, but the shop screen works in the
     Simulator too, so you can test the data path there.

> If results are empty: the server isn't reachable (wrong URL/IP, server not
> running, or the ATS exception is missing). Check `/health` from the device's
> browser first.

## Deploy

Any Node host works (Render, Railway, Fly.io, a VPS). Set the build command to
`pnpm install && pnpm build && pnpm test` and the start command to `pnpm start`
(Node ≥ 18). Put the public URL into `BackendConfig.baseURL`.

## Try-on color accuracy (how the shade color is chosen)

`/catalog` sets each shade's color in this priority:

1. **Curated exact hex** for famous shades (Dior 999, MAC Ruby Woo, …) — matched
   loosely on brand + shade text. Add more in `src/lib/product/curated-colors.ts`.
2. **Estimated from the product photo** (`src/lib/color/`): downloads the Digikala
   image and averages the vivid, lip-plausible pixels (rejecting white/gray
   packaging, black, and blue/green). Tunable thresholds live in
   `src/lib/color/color-math.ts` (`dominantVividColor`).
3. **Variant `hex_code`** from Digikala as a last resort.

Honest limits: this is "mostly matches," not pixel-exact. The photo is usually
the tube/packaging, not a calibrated swatch, so some shades will be off — nudes
(low saturation) are the hardest. The only truly-exact source is a calibrated
swatch library (e.g. Banuba/Perfect Corp) or brand-supplied shade data. Use
`/raw?q=...` to inspect Digikala's response and `/catalog?q=...` to see the
resulting colors; widen the curated list for the shades you care most about.

## Data sources — honest guidance

- **mock** (default): returns each Iranian shop's own *search* page for the
  query. Works with zero setup, but they're search links, not exact products,
  and prices are samples.
- **torob**: calls Torob's public search endpoint. This is **unofficial** — the
  field names may change and it may rate-limit or block; verify the mapping in
  `torobSearch()` against a live response, and review Torob's terms.
- **Recommended for production:** apply to the **affiliate/partner programs** of
  Digikala and Basalam. They give you an API key and real product data + your
  referral links (you also earn commission). Add a provider function here that
  calls them, keep the key server-side, and the app needs no changes.

## Notes

- Keep all API keys on this server — never in the app.
- The `/health` endpoint reports the active provider.
