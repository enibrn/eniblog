import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';

export function getItemsFromDendronNotes() {
  const notes = JSON.parse(fs.readFileSync('notes/.dendron.cache.json', 'utf-8')).notes;
  delete notes.root;

  return Object.keys(notes).map(key => {
    const itemData = notes[key].data;
    return {
      //copied props from dendron structure
      key: key,
      title: itemData.title,
      created: itemData.created,
      updated: itemData.updated,
      //custom props for vitepress
      side: itemData.vp?.side ?? false,
      linkToLastNote: itemData.vp?.linkToLastNote ?? false, //not tested
      //ogdateString: itemData.vp?.ogdate, //not needed for metadata
      //calculated props
      nav_order: itemData.nav_order ?? 999,
      level: key.split('.').length,
      createdDate: new Date(itemData.created),
      updatedDate: new Date(itemData.updated),
    };
  });
}


/* not dependent from .dendron.cache.json anymore:
 * - no need to include that in git (changes everytime)
 * - no need to refresh it manually
 */
export function getItemsFromDendronNotes2() {
  const directory = 'notes';

  return fs
    .readdirSync(directory)
    .filter(file => path.extname(file) === '.md' && file !== 'root.md')
    .map(file => {
      const filePath = path.join(directory, file);
      const fileContent = fs.readFileSync(filePath, 'utf8');
      const { data } = matter(fileContent);
      const key = path.parse(file).name;

      return {
        //copied props from dendron structure
        key: key,
        title: data.title,
        created: data.created,
        updated: data.updated,
        //custom props for vitepress
        side: data.vp?.side ?? false,
        linkToLastNote: data.vp?.linkToLastNote ?? false, //not tested
        //ogdateString: data.vp?.ogdate, //not needed for metadata
        //calculated props
        nav_order: data.nav_order ?? 999,
        level: key.split('.').length,
        createdDate: new Date(data.created),
        updatedDate: new Date(data.updated),
      };
    });
}