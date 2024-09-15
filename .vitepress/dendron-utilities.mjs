import fs from 'fs';

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
