import fs from 'fs';

//should be refactored with composable pattern instead of oop? Or a mix of the two
export class SiteMetadataService {
  // public props
  nav = []; //will render the navigation menu
  sidebar = {}; //will render the sidebars, one for each nav link
  linksVocabulary = {}; //needed to translate wikilinks labels, from keys to titles
  homeCards = [];

  // private props
  #items = []; //item is the new view of the dendron note (a subset of its props and new calculated props)
  #sidebarLeafLinks = {}; //needed to park the nav items 
  #leafItems = []; //needed to park all the leaf items

  constructor(getItemsFn) {
    this.#items = getItemsFn();

    this.#traverseItemsHierarchically();
    this.#setHomeCards();
  }

  #traverseItemsHierarchically() {
    const highestItemsOrdered = this.#items
      .filter(x => x.level === 1)
      .sort((a, b) => a.nav_order - b.nav_order);

    highestItemsOrdered.forEach(item => {
      this.nav.push(this.#traverseUntilSideItem(item));
    });
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
      this.#leafItems.push({ ...item, link: result.link });

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

  #setHomeCards() {
    const lastCreatedItems = this.#leafItems
      .sort((a, b) => b.created - a.created)
      .slice(0, 4);
    const lastCreatedCards = this.#getHomeCards(lastCreatedItems, true);

    const lastUpdatedItems = this.#leafItems
      .filter(x => !lastCreatedItems.some(y => y.key === x.key)) //exclude newly created items
      .sort((a, b) => b.updated - a.updated)
      .slice(0, 4);
    const lastUpdatedCards = this.#getHomeCards(lastUpdatedItems, false);
    this.homeCards = lastCreatedCards.concat(lastUpdatedCards);
  }

  #getHomeCards(lastItems, isNew) {
    const results = [];

    lastItems.forEach(item => {
      const fcontent = fs.readFileSync(`notes/${item.key}.md`, 'utf-8');

      const result = {
        title: item.title,
        details: SiteMetadataService.#getCardBody(fcontent, item, isNew),
        link: item.link,
        //image not implemented currently
        // icon: {
        //   src: SiteMetadataService.#getFirstImageLink(fcontent),
        //   width: '100px'
        // }
      };

      results.push(result);
    });

    return results;
  }

  static #getCardBody(fcontent, item, isNew) {
    const excerpt = SiteMetadataService.#getExcerpt(fcontent);

    const badgeClass = isNew ? "tip" : "info";

    const formatDate = (date) => Intl.DateTimeFormat().format(date);
    const dateString = isNew ? formatDate(item.createdDate) : formatDate(item.updatedDate);
    const badgeText = isNew ? `Creato il ${dateString}` : `Aggiornato il ${dateString}`;

    const result = `${excerpt}<br><br><span class="VPBadge ${badgeClass}">${badgeText}</span>`;
    return result;
  }

  static #getExcerpt(fcontent) {
    //this will take the incipit between the two --- lines, or the rest of the article
    //it could throw an error on [2] if blank note, should never happen
    //elsewhere rethink also how lastItems are taken, skip blank note etc...
    const content = fcontent.split("---")[2].split("#")[0].trim();
    return truncate(content, 100, true);

    function truncate(str, n, useWordBoundary) {
      if (str.length <= n) { return str; }
      const subString = str.slice(0, n - 1); // the original check
      return (useWordBoundary
        ? subString.slice(0, subString.lastIndexOf(" "))
        : subString) + "...";//"&hellip;";
    };
  }

  //similar to logic in ImageManager of dendron-move-images
  static #getFirstImageLink(fcontent) {
    let result = null;
    const imageRegex = /!\[([^\]]+)\]\(([^)]+)\)/g;

    let match;
    while ((match = imageRegex.exec(fcontent)) !== null) {
      if (isInCodeBlock(match))
        continue;

      //found the first image
      result = match[2];
      break;
    }

    //TODO needed format: "./notes/assets/images/zirael.jpg"
    return result;

    function isInCodeBlock(match) {
      const stringBeforeMatch = match.input.substring(0, match.index);
      const numOfBackTicks = (stringBeforeMatch.match(/`/g) || []).length;
      return numOfBackTicks % 2 !== 0;
    }
  }
}
