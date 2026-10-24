# Unearthed — seasonal world archive

The home layout follows the supplied Option 2 image: compass landscape, left title, right seasonal plaque, four illustrated cards, dark navigation and footer. The landscape keeps natural warmth with soft detail. The cards use the owner's requested muted seasonal palettes. The original hero.png is retained as a reference. hero-reference.png and season-cards.png are new image assets based on the supplied design.

## 1. Publish the public website

Use **Unearthed-Option-2-Public.zip**. Extract it, then upload the files and staff folder INSIDE it to the root of the existing GitHub Pages repository. Do not upload the ZIP itself or add an extra enclosing folder. Replace the earlier public files. Keep the Pages publishing setting on main / root as before.

Public files: index.html, style.css, reference.css, catalog.js, app.js, season.js, dashboard.js, site-config.js, icons.svg, hero-reference.png, season-cards.png, hero.png, staff/index.html, staff/staff.js, SETUP.md. The public staff folder is only a setup landing page; it contains no character data.

The backend and secret files do not belong in the Pages upload. Public JavaScript, HTML, images, bundled catalog data, and all Git history are visible to visitors. Never add private sheet exports, private character records, service account JSON, .env files or private keys to this repository.

The existing public catalog is preserved: search, region/type/tier filters, sort, pagination, manual refresh, two-minute visible-page refresh, and saved snapshot fallback. It reads the existing seven regional tabs, A5:E, with the existing spreadsheet ID and tab IDs. Its original app.js and catalog.js are unchanged. The live connection returned 347 entries during verification on October 24, 2026. The snapshot is public even if you later revoke Google access; remove it and its repository history if it contains anything that should not be published.

**Private character records must be in separate Restricted spreadsheets.** Hidden tabs in the public catalog spreadsheet are not a security boundary. Do not put private tabs in a spreadsheet that is publicly readable or published to the web.

## 2. Seasons

| Months | Season | Lit pillar |
|---|---|---|
| September–November | Autumn | West |
| December–February | Winter | North |
| March–May | Spring | East |
| June–August | Summer | South |

The calendar uses America/New_York consistently across visitors. It checks on load, every minute, and when the tab becomes visible. The footer selector allows explicitly labelled previews. Previews reset to Automatic on reload. Exactly one pillar light is enabled at a time; the base artwork has all pillars unlit. Navigation accents, status plaque and lighting follow the selected season. The four destination cards retain their individual muted seasonal palettes. Autumn foliage in the landscape is an artistic backdrop and does not claim to change to winter foliage.

## 3. Economy & XP

The card and navigation open an accessible dialog. The supplied files did not contain approved currency, XP or bounty rules, so the dialog explains that the guide is awaiting content. Add approved public rules there when supplied. No XP values or balances are invented.

## 4. Private staff backend — requires your configuration

Use **Unearthed-Staff-Backend.zip**, extracted onto a private Node.js 24+ server. Its backend and staff directories must remain siblings. No dependencies or package installation are required. This scaffold has been tested locally; real sign-in and Google reads have NOT been verified because no credentials, Access application or private sheet configuration were supplied.

1. Choose an HTTPS staff hostname under your domain, such as staff.your-domain.com. Create a Cloudflare Access self-hosted application protecting the entire hostname and all paths, including /api/* and /staff.js. Allow only specific moderator/admin identities through your identity provider. Do not add an Everyone or Bypass policy. Copy the application's AUD tag and your team issuer URL.
2. Connect the hostname to the private Node server using Cloudflare Tunnel. With the default HOST=127.0.0.1, route the tunnel to http://127.0.0.1:8787. Keep the Node port off the public network. Configure your host's service manager to restart the Node process and tunnel after a reboot. Do not expose a public directory or run the public preview server as the private backend.
3. On that private server, copy backend/.env.example to backend/.env. Fill ACCESS_ISSUER (https://YOUR-TEAM.cloudflareaccess.com, no trailing slash), ACCESS_AUDIENCE, and STAFF_EMAILS (comma-separated exact allowed email addresses). The backend independently verifies the Access JWT signature, issuer, audience, expiration and the email allowlist on EVERY request. Merely supplying a forged Access header does not authorize a request. Empty or incorrect configuration fails closed.
4. In your Google Cloud project, enable the Google Sheets API. Create a dedicated service account. Store its JSON key OUTSIDE the checkout and web root, readable only by the server user; set GOOGLE_SERVICE_ACCOUNT_FILE to that absolute file path. Never paste keys into site-config.js or upload them to GitHub. Share ONLY the intended separate private spreadsheets with that service account as Viewer. Keep their general access Restricted. This backend requests spreadsheets.readonly and has no write route.
5. Fill CHARACTER_SHEETS_ID and CHARACTER_REGISTRY_ID in the PRIVATE .env. Fill the corresponding RANGE values with fixed, bounded, approved web-view ranges. Preserve double quotes around values such as "'Approved Web View'!A1:H1000". Only include columns staff should see. The first row is used as table headings. Sheet schemas were not supplied: these are configurable read-only tables, not a completed custom character editor. The browser cannot choose arbitrary spreadsheet IDs or ranges.
6. From the backend directory, run `npm test`, then `npm start`. Serve it only through the protected HTTPS hostname. Authorized staff can view /#sheets and /#registry; missing credentials receive 403, and unavailable Google configuration returns 503 without exposing upstream error details. No response containing staff information is cacheable. No credentials or private records are logged by the code.
7. In the PUBLIC site-config.js, set staffPortalUrl to your protected HTTPS ORIGIN, for example `https://staff.your-domain.com`. This address is public, not a secret. Republish this one configuration file. All four staff navigation/card links will point to the protected portal. Until configured, they lead to the honest setup landing page.
8. Change the staff/index.html archive backlink to the full public site URL on your server if you want it to return across domains. Leave its staff.js script on the same protected origin. Sign out clears the visible records and navigates to Cloudflare Access logout. Staff records are never stored in localStorage or bundled snapshots.

Before using real records, test with a small non-sensitive private test spreadsheet and check: signed-out requests are denied; an authenticated non-staff user is denied; allowed staff can read only each fixed configured range; POST is rejected; a missing Google key shows an unavailable message; removing a user from STAFF_EMAILS and restarting denies their next request. Access policy changes and session revocation should also be managed through Cloudflare. Keep server/tunnel software updated and rotate a key if exposed.

Official references: [Cloudflare application tokens](https://developers.cloudflare.com/cloudflare-one/access-controls/applications/http-apps/authorization-cookie/application-token/) and [Google Sheets scopes](https://developers.google.com/workspace/sheets/api/scopes). Google permissions apply to the whole spreadsheet, so dedicated private spreadsheets and a least-privilege Viewer account matter.

## 5. Verification and preview

The five automated tests cover all twelve months, valid staff authentication, missing/expired/wrong-audience/wrong-issuer/future/non-staff credentials, forged signatures, an empty allowlist, and HTTP requests that cannot read a private sheet before authorization. Tests use generated test keys and fake records, not your credentials.

From the complete source folder: `node --test backend/auth.test.mjs season.test.cjs`.

The design has been visually checked in the in-app browser. The public catalog's live sync was verified. Private live integration and hosting remain setup steps. This delivery does not publish to your GitHub account or claim that private sign-in already works.

