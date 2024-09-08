import fs from 'fs';

export class Menu {
  // public props
  nav = [];
  sidebar = {};
  linksVocabulary = {};

  // private props
  #items;
  #sidebarLeafLinks = {};

  constructor() {
    this.#setItemsFromDendronNotes();
    this.#generateMenuFromItems();
  }

  #setItemsFromDendronNotes() {
    const notes = JSON.parse(fs.readFileSync('notes/.dendron.cache.json', 'utf-8')).notes;
    delete notes.root;

    this.#items = Object.keys(notes).map(key => {
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
  }

  #generateMenuFromItems() {
    const highestItemsOrdered = this.#items
      .filter(x => x.level === 1)
      .sort((a, b) => a.order - b.order);

    highestItemsOrdered.forEach(item => {
      this.nav.push(this.#buildRecursiveNav(item));
    });
  }

  #buildRecursiveNav(item) {
    const childItems = this.#getChildsOrdered(item);
    const result = { text: item.title };

    if (item.side) {
      //sidebar management
      const sidebarItems = [];
      childItems.forEach(childItem => {
        sidebarItems.push(this.#buildRecursiveSidebar(childItem, item.key));
      });
      this.sidebar[item.key] = sidebarItems;

      //the nav link goes to the proper preselected "leaf" page
      const sidebarLeafLink = this.#sidebarLeafLinks[item.key];
      result.link = sidebarLeafLink;
    } else {
      result.items = [];
      childItems.forEach(childItem => {
        result.items.push(this.#buildRecursiveNav(childItem));
      });
    }

    return result;
  }

  #buildRecursiveSidebar(item, navKey) {
    const childItems = this.#getChildsOrdered(item);
    const result = { text: item.title };

    if (childItems.length == 0) {
      result.link = item.key;
      this.linksVocabulary[item.key] = item.title;

      //if linkToFirstNote is present it will set the link of the sidebar to the current note only if not exist
      // i.e. only on the first leaf note, otherwise the link will be set to the last leaf note processed
      if (!item.linkToFirstNote || !this.#sidebarLeafLinks[navKey])
        this.#sidebarLeafLinks[navKey] = result.link;

    } else {
      result.items = [];
      childItems.forEach(childItem => {
        result.items.push(this.#buildRecursiveSidebar(childItem, navKey));
      });
    }

    return result;
  }

  #getChildsOrdered(father) {
    return this.#items
      .filter(item => {
        const regex = new RegExp(`^${father.key}\\.([^\\.]+)$`);
        return regex.test(item.key);
      })
      .sort((a, b) => a.order - b.order);
  }
}
