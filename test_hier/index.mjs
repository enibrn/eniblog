
import fs from 'fs';

const notes = JSON.parse(fs.readFileSync('notes/.dendron.cache.json', 'utf-8')).notes;
delete notes.root;

fs.writeFileSync('test_hier/flatStructure.json', JSON.stringify(notes, null, 2));

const keys = Object.keys(notes);
const firstLevelKeys = keys.filter(x => x.indexOf('.') === -1);

const menu = {
  nav: [],
  sidebar: {}
};

const sidebarLeafLinks = {};

firstLevelKeys.forEach(key => {
  menu.nav.push(buildRecursiveNav(key));
});

console.log(sidebarLeafLinks);
fs.writeFileSync('test_hier/menu.json', JSON.stringify(menu, null, 2));

function buildRecursiveNav(key) {
  const noteData = notes[key].data;
  const sonsKeys = getSonsKeys(key);
  const result = { text: noteData.title };

  if (noteData.side) {
    const sidebarItems = [];
    sonsKeys.forEach(keySon => {
      sidebarItems.push(buildRecursiveSidebar(keySon, key));
    });
    const sidebarLeafLink = sidebarLeafLinks[key];
    
    //menu.side[sidebarLeafLink] = sidebarItems;
    menu.sidebar[key] = sidebarItems;

    result.link = sidebarLeafLink;
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

function buildRecursiveSidebar(key, navKey) {
  const noteData = notes[key].data; 
  const sonsKeys = getSonsKeys(key);
  const result = { text: noteData.title };

  if (sonsKeys.length == 0) {
    result.link = key;

    //if linkToFirstNote is present it will set the link of the sidebar to the current note only if not exist
    // i.e. only on the first leaf note, otherwise the link will be set to the last leaf note processed
    if (!noteData.linkToFirstNote || !sidebarLeafLinks[navKey])
      sidebarLeafLinks[navKey] = result.link;

  } else {
    result.items = [];
    sonsKeys.forEach(keySon => {
      result.items.push(buildRecursiveSidebar(keySon, navKey));
    });
  }

  return result;
}