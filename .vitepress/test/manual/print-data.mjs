import { getItemsFromDendronNotes } from '../../dendron-utilities.mjs'
import { SiteMetadataService } from '../../site-metadata-service.mjs'
import fs from 'fs';

const siteMetadata = new SiteMetadataService(getItemsFromDendronNotes, true);
fs.writeFileSync('.vitepress/test/manual/temp/printed-data.json', JSON.stringify(siteMetadata, null, 2));