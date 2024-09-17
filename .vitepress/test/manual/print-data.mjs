import { getItemsFromDendronNotes, getItemsFromDendronNotes2 } from '../../dendron-utilities.mjs'
import { SiteMetadataService } from '../../site-metadata-service.mjs'
import fs from 'fs';

const siteMetadata = new SiteMetadataService(getItemsFromDendronNotes, true);
fs.writeFileSync('.vitepress/test/manual/temp/printed-data.json', JSON.stringify(siteMetadata, null, 2));

const siteMetadata2 = new SiteMetadataService(getItemsFromDendronNotes2, true);
fs.writeFileSync('.vitepress/test/manual/temp/printed-data-2.json', JSON.stringify(siteMetadata, null, 2));