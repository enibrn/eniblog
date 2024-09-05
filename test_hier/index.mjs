
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

const sideLinks = {};

firstLevelKeys.forEach(key => {
  menu.nav.push(buildRecursiveNav(key));
});

console.log(sideLinks);
fs.writeFileSync('test_hier/menu.json', JSON.stringify(menu, null, 2));

function buildRecursiveNav(key) {
  const noteData = notes[key].data;
  const sonsKeys = getSonsKeys(key);
  const result = { text: noteData.title };

  if (noteData.side) {
    const sidebarItems = [];
    sonsKeys.forEach(keySon => {
      sidebarItems.push(buildRecursiveSide(keySon, key));
    });
    const sideLink = sideLinks[key];
    
    //menu.side[sideLink] = sidebarItems;
    menu.side[`notes/${key}`] = sidebarItems;

    result.link = sideLink;
  } else {
    result.items = [];
    sonsKeys.forEach(keySon => {
      result.items.push(buildRecursiveNav(keySon));
    });
  }

  return result;
}

function getSonsKeys(key) {
  return keys.filter(item => {
    const regex = new RegExp(`^${key}\\.([^\\.]+)$`);
    return regex.test(item);
  });
}

function buildRecursiveSide(key, navKey) {
  const noteData = notes[key].data; 
  const sonsKeys = getSonsKeys(key);
  const result = { text: noteData.title };

  if (sonsKeys.length == 0) {
    result.link = `notes/${key}`;

    //if linkToFirstNote is present it will set the link of the sidebar to the current note only if not exist
    // i.e. only on the first leaf note, otherwise the link will be set to the last leaf note processed
    if (!noteData.linkToFirstNote || !sideLinks[navKey])
      sideLinks[navKey] = result.link;

  } else {
    result.items = [];
    sonsKeys.forEach(keySon => {
      result.items.push(buildRecursiveSide(keySon, navKey));
    });
  }

  return result;
}