
import path from 'path';
import fs from 'fs';

const notes = JSON.parse(fs.readFileSync('notes/.dendron.cache.json', 'utf-8')).notes;
delete notes.root;

fs.writeFileSync('test_hier/flatStructure.json', JSON.stringify(notes, null, 2));

const result = {
  nav: [],
  side: {}
};

const keys = Object.keys(notes);
const firstLevelKeys = keys.filter(x => x.indexOf('.') === -1);

firstLevelKeys.forEach(key => {
  result.nav.push(doRecursive(key));
});

fs.writeFileSync('test_hier/menu.json', JSON.stringify(result, null, 2));

function doRecursive(keyFather) {
  const result = {
    text: notes[keyFather].data.title,
    items: []
  };

  const sonsKeys = getSonsKeys(keyFather);

  sonsKeys.forEach(keySon => {
    result.items.push(doRecursive(keySon));
  });

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