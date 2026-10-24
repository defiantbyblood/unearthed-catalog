# Unearthed website update

## Upload the public site

Extract **Unearthed-Website-Update.zip**. In your existing GitHub repository, use **Add file > Upload files** and upload everything INSIDE the extracted folder, including **resource-art** and **staff**. Replace the matching files, commit, wait for GitHub Pages, then refresh the website with Ctrl+F5. No Pages settings change is required.

Do not upload the backend ZIP, private data, credentials, keys, or .env files to GitHub Pages. The public package is built from an explicit file list and contains no character records.

## What changed

- A single fixed top menu. The four home navigation boxes have been removed.
- The seasonal wayfinder remains above every destination. Each page opens below it with a title and description.
- Automatic America/New_York calendar: West/Autumn Sep–Nov, North/Winter Dec–Feb, East/Spring Mar–May, South/Summer Jun–Aug. Only that pillar is lit.
- Winter snow, spring blossoms, summer greenery and the approved autumn landscape preserve the same wayfinder composition. Footer previews reset to Automatic on reload.
- All 347 existing resource entries have small expandable reference illustrations, mapped to 271 distinct resource names. Repeat resources share the same illustration. New names added to the live spreadsheet show an honest illustration-pending placeholder until art is added; they do not disappear from the catalog.
- Economy & XP has Experience Points and Coin boxes with searchable illustrated entries underneath.
- Bounties, Assassinations & Quests is a separate page. Its boxes show Bounties, Assassinations, Quests & Tasks, and Completed Events. The two contract categories come from the same Contracts Board source tab. Duplicate posting IDs are retained, and status text is shown as entered in the source. The Completed Events tab currently contains an entry marked Approval needed; the site preserves that value rather than assuming completion.
- Character Sheets and Character Registry open as normal pages without lock icons. The spreadsheet-like roster has Character name, Player name, XP adjusted, Coin adjusted, Updated date, and Updater name. The registry has an Add character sheet popup.

## Google Sheets connections

The existing public resource catalog, filters, sorting, pagination, manual refresh, two-minute visible-page refresh and saved snapshot fallback remain intact. It reads the same seven regional resource tabs. catalog.js is the original saved catalog.

The economy and adventure board read these verified tabs from the public economy workbook:

- Experience Points — gid 1925254100
- Coin — gid 101
- Contracts Board — gid 102
- Quests & Tasks — gid 25650652
- Completed Events — gid 561602065

Source: https://docs.google.com/spreadsheets/d/176hswPG8lZ7G9JNCT0Atp40UmUotYudZpbEelZlxHNk/edit

The site performs read-only public CSV reads, which preserve mixed values such as numeric XP and Varies. It refreshes on opening either page, every two minutes while that page is visible, and on manual refresh. If a read fails, it retains the last successful data or the verified October 24, 2026 snapshot. Adding rows to the existing tabs is supported; renaming or restructuring headers may require a site update. The website does not write to this workbook.

The economy workbook's sharing metadata currently allows anyone with its link to edit. If only moderators should edit it, change Google's general access to Viewer while keeping named moderator editors. This update does not change Google's permissions.

Never place private character data in hidden tabs of these public spreadsheets. Public snapshots and website files are visible to everyone and remain in Git history.

## Shared character roster: separate connection required

**GitHub Pages cannot save a shared roster.** Until the moderator backend is configured, the public character pages explain that it is not connected. The Add popup can be previewed, but its save button is disabled. No browser-only roster is presented as a shared list, and no production records are invented.

The backend serves the SAME full website, including its fixed menu and seasonal wayfinder, behind moderator sign-in. Moderators use that protected hostname to read/add/update the shared roster. This is also the deployment option for making the entire site moderator-only; a public GitHub Pages URL itself is not access-controlled by hiding links.

1. Extract **Unearthed-Moderator-Backend.zip** onto a private Node.js 24+ server. Keep backend, staff, resource-art, and the public files together in the extracted structure. Do not upload this archive to GitHub Pages.
2. Set up a Cloudflare Access self-hosted application for a hostname you control, such as staff.your-domain.com. Protect the entire hostname and all paths. Allow only the intended moderator identities; do not use an Everyone or Bypass policy. Copy your team issuer URL and the application's AUD tag.
3. Route that hostname through Cloudflare Tunnel to http://127.0.0.1:8787. Keep the Node port private. Set your host's service manager to run the Node server and tunnel after reboot.
4. On the server only, copy backend/.env.example to backend/.env. Fill ACCESS_ISSUER, ACCESS_AUDIENCE, and STAFF_EMAILS. Set PUBLIC_ORIGIN to the exact HTTPS hostname, without a trailing slash. Set REGISTRY_DATA_FILE to an absolute file path on durable private storage outside the web root and Git checkout. Use one Node instance per roster file and back up that file; ephemeral hosting storage is unsuitable.
5. From the backend directory run `npm test`, then `npm start`. No package installation is needed. All roster requests validate the signed Access token, issuer, audience, expiration and email allowlist. Writes also require the configured same origin and JSON content type. Missing authentication fails closed.
6. Open the protected hostname. Add a Google Sheets link, character/player names, and XP/coin totals. Duplicate sheet links are rejected. The server records the signed-in updater and UTC date automatically. Adjust changes the roster's recorded totals, not the original Google spreadsheet. The linked sheet remains governed by Google's own sharing permissions. This link registry needs no Google service-account credentials.
7. In the PUBLIC site-config.js, set staffPortalUrl to the protected HTTPS origin. Republish that configuration file. The unconnected public character page then offers an Open connected moderator workspace link. Moderators can bookmark the protected full site directly.

The legacy /api/sheets and /api/registry raw-sheet readers remain optional and protected. Their GOOGLE_SERVICE_ACCOUNT_FILE and CHARACTER_* environment values are not needed for the new shared link registry. If using those optional readers, keep the key outside the checkout and use a Viewer-only service account against separate Restricted character spreadsheets.

No production Access application, credentials, domain, persistent server, or live character roster was supplied or deployed in this task. Shared saving was verified with an isolated local test roster and automated security tests. Real deployment remains a setup step.

The moderator host restricts remote script execution. The resource catalog's original Google JSONP refresh is therefore blocked there and uses its saved catalog fallback; it still syncs normally on the public GitHub Pages site. Economy/board CSV refresh is allowed on both hosts.

## Art and verification

Generated reference art is representative, including fictional materials and creatures; it is not photographic identification or gameplay authority. The final assets use WebP to keep the public download small. Original PNG artwork remains in the working source folder but is not required in this upload.

Verified: all twelve month mappings; all 347 resource image mappings; resource search, pagination, thumbnails and expansion; separate economy/board navigation; read-only economy CSV sync including Varies and coin conversions; fixed navigation while scrolling; shared character creation and adjustment persisting after reload in an isolated test; and eight automated authentication, origin, input-validation, persistence, duplicate and concurrency checks. No test records are included in the packages.
