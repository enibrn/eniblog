import fs from 'fs';

//should be refactored with composable pattern instead of oop? Or a mix of the two
export class DataParser {
  // public props
  nav = []; //will render the navigation menu
  sidebar = {}; //will render the sidebars, one for each nav link
  linksVocabulary = {}; //needed to translate wikilinks labels, from keys to titles
  lastCreatedPages = [];
  lastUpdatedPages = [];

  // private props
  #items = []; //item is the new view of the dendron note (a subset of its props and new calculated props)
  #sidebarLeafLinks = {}; //needed to park the nav items 
  #leafItems = []; //needed to park the whole leaf items

  constructor() {
    this.#setItemsFromDendronNotes();
    this.#generateDataFromItems();
  }

  //this items setter function should be moved from here (like passed to the constructor and invoked there)
  //to be dendron agnostic or to easily change the logic of retrieving notes metadata
  #setItemsFromDendronNotes() {
    const notes = JSON.parse(fs.readFileSync('notes/.dendron.cache.json', 'utf-8')).notes;
    delete notes.root;

    this.#items = Object.keys(notes).map(key => {
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
        // createdDate: new Date(itemData.created),
        // updatedDate: new Date(itemData.updated),
      };
    });
  }

  #generateDataFromItems() {
    const highestItemsOrdered = this.#items
      .filter(x => x.level === 1)
      .sort((a, b) => a.nav_order - b.nav_order);

    highestItemsOrdered.forEach(item => {
      this.nav.push(this.#traverseUntilSideItem(item));
    });

    const lastCreatedItems = this.#leafItems
      .sort((a, b) => b.created - a.created)
      .slice(0, 4);
    const lastUpdatedItems = this.#leafItems
      .filter(x => !lastCreatedItems.some(y => y.key === x.key)) //exclude newly created items
      .sort((a, b) => b.updated - a.updated)
      .slice(0, 4);

    this.lastCreatedPages = this.#getLastPages(lastCreatedItems);
    this.lastUpdatedPages = this.#getLastPages(lastUpdatedItems);
  }

  #traverseUntilSideItem(item) {
    const childItems = this.#getChildsOrdered(item);
    const result = { text: item.title };

    if (item.side) {
      //from now on I will traverse from the side item, to manage sidebar and leaf data
      const sidebarItems = [];
      childItems.forEach(childItem => {
        sidebarItems.push(this.#traverseAfterSideItem(childItem, item.key));
      });
      this.sidebar[item.key] = sidebarItems;

      //the nav link goes to the proper preselected "leaf" page
      const sidebarLeafLink = this.#sidebarLeafLinks[item.key];
      result.link = sidebarLeafLink;
    } else {
      result.items = [];
      childItems.forEach(childItem => {
        result.items.push(this.#traverseUntilSideItem(childItem));
      });
    }

    return result;
  }

  #traverseAfterSideItem(item, navKey) {
    const childItems = this.#getChildsOrdered(item);
    const result = { text: item.title };

    if (childItems.length == 0) { // is a leaf item, therefore a page
      result.link = '/' + item.key; //vitepress needs / before links
      this.linksVocabulary[item.key] = item.title;
      this.#leafItems.push(item);

      // the fist note as entry point of the sidebar is the default behaviour
      // to override set the prop linkToLastNote
      if (item.linkToLastNote || !this.#sidebarLeafLinks[navKey])
        this.#sidebarLeafLinks[navKey] = result.link;

    } else {
      result.items = [];
      childItems.forEach(childItem => {
        result.items.push(this.#traverseAfterSideItem(childItem, navKey));
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
      .sort((a, b) => a.nav_order - b.nav_order);
  }

  #getLastPages(lastItems) {
    const results = [];

    lastItems.forEach(item => {
      const fcontent = fs.readFileSync(`notes/${item.key}.md`, 'utf-8');
      //it could throw an error on [2] if blank note, should never happen
      //elsewhere rethink also how lastItems are taken, skip blank note etc...
      const content = fcontent.split("---")[2].trim();

      const result = {
        excerpt: DataParser.#getExcerpt(content),
        firstImageLink: DataParser.#getFirstImageLink(content),
        title: item.title
      };

      results.push(result);
    });

    return results;
  }

  static #getExcerpt(content) {
    return truncate(content, 100, true);

    function truncate( str, n, useWordBoundary ){
      if (str.length <= n) { return str; }
      const subString = str.slice(0, n-1); // the original check
      return (useWordBoundary 
        ? subString.slice(0, subString.lastIndexOf(" ")) 
        : subString) + "...";//"&hellip;";
    };
  }

  //similar to logic in ImageManager of dendron-move-images
  static #getFirstImageLink(content) {
    let result = null;
    const imageRegex = /!\[([^\]]+)\]\(([^)]+)\)/g;

    let match;
    while ((match = imageRegex.exec(content)) !== null) {
      if (isInCodeBlock(match))
        continue;

      //found the first image
      result = match[2];
      break;
    }

    return result;

    function isInCodeBlock(match) {
      const stringBeforeMatch = match.input.substring(0, match.index);
      const numOfBackTicks = (stringBeforeMatch.match(/`/g) || []).length;
      return numOfBackTicks % 2 !== 0;
    }
  }
}
