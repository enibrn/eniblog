
import path from 'path';
import fs from 'fs';

const notes = JSON.parse(fs.readFileSync('notes/.dendron.cache.json', 'utf-8')).notes;
delete notes.root;

fs.writeFileSync('test_hier/flatStructure.json', JSON.stringify(notes, null, 2));

const keys = Object.keys(notes);
const firstLevelKeys = keys.filter(x => x.indexOf('.') === -1);

const menu = {
  nav: [],
  side: {}
};
const sidebarsKeys = [];

firstLevelKeys.forEach(key => {
  menu.nav.push(doRecursive(key));
});

console.log(sidebarsKeys);
fs.writeFileSync('test_hier/menu.json', JSON.stringify(menu, null, 2));

function doRecursive(keyFather) {
  const noteData = notes[keyFather].data;
  const sonsKeys = getSonsKeys(keyFather);
  const result = { text: noteData.title };

  if (noteData.side) {
    result.link = `notes/${sonsKeys[0]}`; //link alla prima nota della sidebar (rivedere l'ordinamento, forse impostazione dendron frontmatter)
    sidebarsKeys.push(keyFather); //dopo riparto da queste per generare tutte le sidebar
  } else {
    result.items = [];
    sonsKeys.forEach(keySon => {
      result.items.push(doRecursive(keySon));
    });
  }

  return result;
}

function getSonsKeys(keyFather) {
  return keys.filter(item => {
    const regex = new RegExp(`^${keyFather}\\.([^\\.]+)$`);
    return regex.test(item);
  });
}


// const parts = key.split('.');
// const data = notes.notes[key].data;