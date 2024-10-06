import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';

export function getItemsFromDendronNoteFiles() {
  const notesPath = 'notes';
  return fs
    .readdirSync(notesPath)
    .filter(file => path.extname(file) === '.md' && file !== 'root.md')
    .map(file => {
      const filePath = path.join(notesPath, file);
      const fileContent = fs.readFileSync(filePath, 'utf8');
      const { data } = matter(fileContent);
      const key = path.parse(file).name;

      return {
        //from dendron structure
        guid: data.id,
        key: key,
        title: data.title,
        createdTimestamp: data.created,
        updatedTimestamp: data.updated,
        //custom for vitepress
        side: data.vp?.side ?? false,
        //calculated props
        order: data.nav_order ?? 999,
        level: key.split('.').length,
        createdDate: new Date(data.created),
        updatedDate: new Date(data.updated),
        relativeFilePath: path.join(notesPath, `${key}.md`)
      };
    });
}