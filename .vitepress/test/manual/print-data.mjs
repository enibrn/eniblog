import { getItemsFromDendronNotes } from '../../dendron-utilities.mjs'
import { SiteMetadataService } from '../../data-parser.mjs'
import fs from 'fs';

const siteMetadata = new SiteMetadataService(getItemsFromDendronNotes);
fs.writeFileSync('.vitepress/test/manual/temp/printed-data.json', JSON.stringify(siteMetadata, null, 2));