/* Keep this project in Google Apps Script, outside the public website repository. */
const REGISTRY_ID_ = '1cphSQdDRBjMO3w_mv3F4n2SW2faqJ0wqgHvJeIpodjw';
const TEMPLATE_ID_ = '19GeWtJaxDaakvzlWtW3egwTT1Ch5HRbXUt-9mnX-Zwk';
const WEBSITE_ = 'https://defiantbyblood.github.io/unearthed-catalog/';
const HEADERS_ = ['Character ID','Character Name','Player Name','Sheet URL','XP Adjusted','Coin Adjusted','Updated Date','Updater Name','Player View URL','Status','Tab Map'];
const TABS_ = [['info','Character Information'],['details','Character Details'],['inventory','Character Inventory'],['trees','Mutation Skill Trees'],['audit','Earnings Audit Sheet'],['professions','[Linked] Professional Skills'],['spells','[Linked] Universal Spells'],['arsenal','[Linked] Arsenal Sheet'],['flaws','[Linked] Flaw List'],['mutations','[Linked] Mutations Sheet']];

function moderator_() {
  const email = String(Session.getActiveUser().getEmail() || '').toLowerCase();
  let accounts;
  try { accounts = JSON.parse(PropertiesService.getScriptProperties().getProperty('MODERATOR_ACCOUNTS') || '{}'); }
  catch (_) { throw new Error('The owner needs to repair the moderator account settings.'); }
  if (!email || !Object.prototype.hasOwnProperty.call(accounts, email) || typeof accounts[email] !== 'string' || !accounts[email].trim()) {
    throw new Error('Sign in with an approved moderator Google account. Ask the owner to add your account to the moderator settings.');
  }
  return {name: accounts[email].trim().slice(0,100)};
}

function doGet(e) {
  try {
    moderator_();
    const page = HtmlService.createTemplateFromFile('Portal');
    const id = String(e && e.parameter && e.parameter.sheet || '');
    page.initialSheet = /^[A-Za-z0-9_-]{20,}$/.test(id) ? 'https://docs.google.com/spreadsheets/d/' + id + '/edit' : '';
    return page.evaluate().setTitle('Unearthed · Add Character Sheet');
  } catch (_) {
    return HtmlService.createHtmlOutput('<h1>Moderator sign-in required</h1><p>Use an approved Google account. Ask the owner to check the moderator settings and deploy this app as the user accessing it.</p>');
  }
}

function sheetId_(url) {
  const match = String(url || '').trim().match(/^https:\/\/docs\.google\.com\/spreadsheets\/(?:u\/\d+\/)?d\/([A-Za-z0-9_-]{20,})(?:[/?#]|$)/);
  if (!match) throw new Error('Paste a Google Sheets sharing link.');
  if (match[1] === TEMPLATE_ID_ || match[1] === REGISTRY_ID_) throw new Error('Use the player’s completed copy, not the master template or registry.');
  return match[1];
}

function publicRows_(id,gid) {
  const response = UrlFetchApp.fetch('https://docs.google.com/spreadsheets/d/' + id + '/export?format=csv&gid=' + gid, {muteHttpExceptions:true,followRedirects:true});
  const content = response.getContentText();
  if (response.getResponseCode() !== 200 || /^\s*</.test(content) || content.length > 4000000) throw new Error('The character sheet is not publicly readable. Set General access to Anyone with the link, Viewer, and try again.');
  return Utilities.parseCsv(content.replace(/^\uFEFF/,''));
}

function inspect_(url) {
  const id = sheetId_(url), book = SpreadsheetApp.openById(id), map = {};
  TABS_.forEach(function(tab) {
    const sheet = book.getSheetByName(tab[1]);
    if (!sheet) throw new Error('Missing character-sheet tab: ' + tab[1] + '. Use a complete copy of the master character sheet.');
    map[tab[0]] = sheet.getSheetId();
  });
  const info = publicRows_(id,map.info), audit = publicRows_(id,map.audit);
  const at = function(rows,r,c) { return String(rows[r] && rows[r][c] || '').trim(); };
  if (at(info,5,2) !== 'Player Information' || at(info,8,2) !== 'Character Information' || at(info,11,2) !== 'Character Stats') throw new Error('The character sheet does not match the Unearthed template layout.');
  const character = at(info,9,6), player = at(info,6,4), xp = at(audit,2,2), coin = at(audit,2,6);
  if (!character || !player) throw new Error('Fill in Character Name and Player Name on the Google Sheet first.');
  if (!xp || !coin || /^#/.test(xp) || /^#/.test(coin)) throw new Error('Repair the Adjusted XP and Adjusted Coin cells on the Earnings Audit Sheet first.');
  const link = WEBSITE_ + '#character=' + id + '&tabs=' + TABS_.map(function(tab) {return map[tab[0]];}).join(',');
  return {sheetId:id,character:character,player:player,xp:xp,coin:coin,sheetUrl:'https://docs.google.com/spreadsheets/d/' + id + '/edit',playerUrl:link,tabMap:map};
}

function inspectCharacter(url) {
  moderator_();
  return inspect_(url);
}

function text_(value) {
  const text = String(value == null ? '' : value);
  return /^[\s]*[=+@-]/.test(text) ? "'" + text : text;
}

function registerCharacter(url,confirmedViewer) {
  const moderator = moderator_();
  if (confirmedViewer !== true) throw new Error('Confirm the character sheet is shared as Anyone with the link, Viewer.');
  // Read the source again. Never trust a name, amount, updater, or URL supplied by a browser preview.
  const record = inspect_(url), lock = LockService.getScriptLock();
  lock.waitLock(30000);
  try {
    const book = SpreadsheetApp.openById(REGISTRY_ID_), sheet = book.getSheetByName('Character Registry');
    if (!sheet) throw new Error('The Character Registry tab is missing.');
    const headers = sheet.getRange(1,1,1,HEADERS_.length).getDisplayValues()[0];
    if (!HEADERS_.every(function(value,index) {return value === headers[index];})) throw new Error('Restore the original Character Registry column headings before submitting.');
    const count = Math.max(sheet.getLastRow()-1,0);
    if (count > 5000) throw new Error('The registry has reached its configured size limit.');
    const rows = count ? sheet.getRange(2,1,count,HEADERS_.length).getDisplayValues() : [];
    const match = rows.findIndex(function(row) {return row[3] === record.sheetUrl;});
    const rowNumber = match < 0 ? count+2 : match+2;
    if (rowNumber > sheet.getMaxRows()) sheet.insertRowsAfter(sheet.getMaxRows(),rowNumber-sheet.getMaxRows());
    const characterId = match < 0 ? Utilities.getUuid() : rows[match][0];
    const values = [characterId,text_(record.character),text_(record.player),record.sheetUrl,text_(record.xp),text_(record.coin),new Date(),text_(moderator.name),record.playerUrl,'Active',JSON.stringify(record.tabMap)];
    sheet.getRange(rowNumber,1,1,values.length).setValues([values]);
    sheet.getRange(rowNumber,7).setNumberFormat('yyyy-mm-dd hh:mm');
    SpreadsheetApp.flush();
    return {character:record.character,playerUrl:record.playerUrl,sheetUrl:record.sheetUrl,updated:match >= 0};
  } finally { lock.releaseLock(); }
}
