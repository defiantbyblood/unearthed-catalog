# Connect the character master list

The real master list has already been created:
https://docs.google.com/spreadsheets/d/1cphSQdDRBjMO3w_mv3F4n2SW2faqJ0wqgHvJeIpodjw/edit

The website does not need a separate Registry page. This spreadsheet is its shared storage. Do not change the column headings.

## One-time Google setup

1. Open the spreadsheet above. Click **Share**. Add each moderator’s Google account as **Editor**. Set General access to **Anyone with the link → Viewer** so the website can read the approved list. This exposes the registry’s names, summaries, and character links to anyone who has the link. Keep private staff notes elsewhere.
2. In that spreadsheet, choose **Extensions → Apps Script**. Name the project **Unearthed Character Registration**.
3. Replace the default `Code.gs` contents with the included `Code.gs`. Click **+ → HTML**, name it **Portal**, and paste the included `Portal.html` contents.
4. In **Project Settings**, enable **Show appsscript.json manifest file in editor**. Open that file in the editor and replace its contents with the included `appsscript.json`.
5. In **Project Settings → Script Properties**, add the property **MODERATOR_ACCOUNTS**. Its value is a list of your actual Google account emails and the public updater names you want shown. For example, replace both example addresses before saving:

   `{"your-google-email@example.com":"Your moderator name","another-moderator@example.com":"Their moderator name"}`

   Use lowercase email addresses. Keep these settings in Apps Script, never in the website files. Every submission checks the signed-in account against this list.
6. Save. Choose **Deploy → New deployment → Web app**. Set **Execute as: User accessing the web app** and **Who has access: Anyone with Google account**. Do not choose “Me” or anonymous access. Each moderator signs in and authorizes the app using their own account, and needs Editor access to the registry. Your Google account or Workspace administrator may restrict deployment or authorization; resolve those restrictions in Google before expecting submissions to work.
7. Deploy and copy the Web app URL ending in `/exec`. Open it in your browser while signed into an approved moderator account. Finish Google’s authorization steps for your own project. Do not share OAuth tokens or passwords.
8. In the website’s `site-config.js`, paste that URL between the quotes after `characterRegistrationUrl:`. Upload the updated `site-config.js` to GitHub. No secret keys belong in this file; the URL is public, while Google authenticates submissions.

## The everyday workflow

1. A moderator copies the master character template and completes it with the player. Keep all template tabs and names intact.
2. Share that character copy as **Anyone with the link → Viewer**. The website shows the sheet’s public contents; do not put staff secrets in it.
3. On the website, open **Character Sheets → Add New Character Sheet**, paste its Google Sheets link, and continue to Google.
4. Preview the character, confirm Viewer sharing, then click **Submit character**. This writes the character’s name, player, adjusted XP, adjusted coin, date, updater name, source link, and player link to the master registry.
5. Return to Character Sheets and refresh the list. It also refreshes every two minutes. Google’s public spreadsheet download can cache new rows for a few minutes. The newly generated player link works directly without waiting for the registry download.
6. Copy that player link into Discord. The themed character display includes **Open Google Sheet**. It reads the character’s current source values when opened and periodically while visible.

Submitting the same character sheet again updates its existing registry entry instead of creating a duplicate. List summary values reflect the last submission; the full character view reads the current character sheet. A source sheet that stops being public cannot be displayed. The server verifies anonymous readability; the moderator confirms that sharing grants Viewer rather than Editor access.

## Before calling this live

The code is supplied and tested locally with simulated Google services. It has not been deployed to your Google account. Finish the steps above and submit a completed test copy of the template to verify Google permissions, authorization, registration, and the website together. No invented character records have been placed in your real registry.

Google deployment reference: https://developers.google.com/apps-script/guides/web
