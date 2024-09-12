import fs from 'fs';

export function getItemsFromDendronNotes() {
  const notes = JSON.parse(fs.readFileSync('notes/.dendron.cache.json', 'utf-8')).notes;
  delete notes.root;

  return Object.keys(notes).map(key => {
    const itemData = notes[key].data;
    return {
      //copied props
      key: key,
      title: itemData.title,
      created: itemData.created,
      updated: itemData.updated,
      //safe props
      nav_order: itemData.nav_order ?? 999,
      side: itemData.side ?? false,
      linkToLastNote: itemData.linkToLastNote ?? false,
      //calculated props
      level: key.split('.').length,
      createdDate: new Date(itemData.created),
      updatedDate: new Date(itemData.updated),
    };
  });
}
