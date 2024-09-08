import fs from 'fs';

const notes = JSON.parse(fs.readFileSync('notes/.dendron.cache.json', 'utf-8')).notes;
delete notes.root;
const items = Object.keys(notes).map(key => {
  const itemData = notes[key].data;
  return {
    guid: itemData.id,
    key: key,
    title: itemData.title,
    order: itemData.nav_order ?? 999,
    side: itemData.side ?? false,
    level: key.split('.').length,
    createdDate: new Date(itemData.created),
    updatedDate: new Date(itemData.updated),
  };
});

const menu = { nav: [], sidebar: {} };
const sidebarLeafLinks = {};

const highestItemsOrdered = items
  .filter(x => x.level === 1)
  .sort((a, b) => a.order - b.order);

highestItemsOrdered.forEach(item => {
  menu.nav.push(buildRecursiveNav(item));
});

fs.writeFileSync('poc/test_hier_ordered/menu.json', JSON.stringify(menu, null, 2));


//functions
function buildRecursiveNav(item) {
  const childItems = getChildsOrdered(item);
  const result = { text: item.title };

  if (item.side) {
    //sidebar management
    const sidebarItems = [];
    childItems.forEach(childItem => {
      sidebarItems.push(buildRecursiveSidebar(childItem, item.key));
    });
    menu.sidebar[item.key] = sidebarItems;

    //the nav link goes to the proper preselected "leaf" page
    const sidebarLeafLink = sidebarLeafLinks[item.key];
    result.link = sidebarLeafLink;
  } else {
    result.items = [];
    childItems.forEach(childItem => {
      result.items.push(buildRecursiveNav(childItem));
    });
  }

  return result;
}

function buildRecursiveSidebar(item, navKey) {
  const childItems = getChildsOrdered(item);
  const result = { text: item.title };

  if (childItems.length == 0) {
    result.link = item.key;

    //if linkToFirstNote is present it will set the link of the sidebar to the current note only if not exist
    // i.e. only on the first leaf note, otherwise the link will be set to the last leaf note processed
    if (!item.linkToFirstNote || !sidebarLeafLinks[navKey])
      sidebarLeafLinks[navKey] = result.link;

  } else {
    result.items = [];
    childItems.forEach(childItem => {
      result.items.push(buildRecursiveSidebar(childItem, navKey));
    });
  }

  return result;
}

function getChildsOrdered(father) {
  return items
    .filter(item => {
      const regex = new RegExp(`^${father.key}\\.([^\\.]+)$`);
      return regex.test(item.key);
    })
    .sort((a, b) => a.order - b.order);
}
