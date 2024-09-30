import { getItemsFromDendronNotes, getItemsFromDendronNotes2 } from '../../dendron-utilities.mjs'
import { SiteMetadataService } from '../../site-metadata-service.mjs'
import fs from 'fs';

// const siteMetadata = new SiteMetadataService(getItemsFromDendronNotes, true);
// fs.writeFileSync('.vitepress/test/manual/temp/printed-data.json', JSON.stringify(siteMetadata, null, 2));

const siteMetadata2 = new SiteMetadataService(getItemsFromDendronNotes2, true);
const ts = getFormattedTimestamp();
fs.writeFileSync(`.vitepress/test/manual/temp/printed-data-${ts}.json`, JSON.stringify(siteMetadata2, null, 2));

function getFormattedTimestamp() {
  const date = new Date();
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  const hours = String(date.getHours()).padStart(2, '0');
  const minutes = String(date.getMinutes()).padStart(2, '0');
  const seconds = String(date.getSeconds()).padStart(2, '0');

  return `${year}${month}${day}${hours}${minutes}${seconds}`;
}