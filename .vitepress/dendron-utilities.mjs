import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';

export function getItemsFromDendronNoteFiles() {
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
        order: data.nav_order ?? 999,
        level: key.split('.').length,
        createdDate: new Date(data.created),
        updatedDate: new Date(data.updated),
      };
    });
}