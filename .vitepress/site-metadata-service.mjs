import fs from 'fs';

//should be refactored with composable pattern instead of oop? Or a mix of the two
export class SiteMetadataService {
  // public props
  nav = []; //will render the navigation menu
  sidebar = {}; //will render the sidebars, one for each nav link
  linksVocabulary = {}; //needed to translate wikilinks labels, from keys to titles
  homeCards = [];
  itemsLoggedTest = [];
  srcExclude = [];
  redirects = {};

  // private props
  #items = []; //item is the new view of the dendron note (a subset of its props and new calculated props)
  #sidebarLeafLinks = {}; //needed to park the nav items 
  #leafItems = []; //needed to park all the leaf items

  constructor(getItemsFn, isTest) {
    this.#items = getItemsFn();

    if (isTest) {
      this.itemsLoggedTest = this.#items;
    }

    this.#traverseItemsHierarchically();
    this.#setHomeCards();
  }

  #traverseItemsHierarchically() {
    const highestItemsOrdered = this.#items
      .filter(x => x.level === 1)
      .sort((a, b) => a.order - b.order);

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
        sidebarItems.push(this.#traverseAfterSideItem(childItem, item.key, item.side.landIntoLastPage));
      });
      this.sidebar[item.key] = sidebarItems;

      //the nav link goes to the proper preselected "leaf" page
      const sidebarLeafLink = this.#sidebarLeafLinks[item.key];
      result.link = sidebarLeafLink;

      if (item.side.collapseOtherFirstLevels) {
        const childItemToExpandKey = childItems
          .map(x => x.key)
          .find(x => sidebarLeafLink.startsWith('/' + x + '.'));

          for (let sidebarItem of sidebarItems) {
            if (sidebarItem.key === childItemToExpandKey) {
              sidebarItem.collapsed = false;
            } else {
              sidebarItem.collapsed = true;
            }
          }
      }
    } else {
      result.items = [];
      childItems.forEach(childItem => {
        result.items.push(this.#traverseUntilSideItem(childItem));
      });
    }

    this.srcExclude.push(item.relativeFilePath);

    return result;
  }

  #traverseAfterSideItem(item, navKey, landIntoLastPage) {
    const childItems = this.#getChildsOrdered(item);
    const result = { key: item.key, text: item.title };

    if (childItems.length == 0) { // is a leaf item, therefore a page
      result.link = '/' + item.key; //vitepress needs / before links
      this.linksVocabulary[item.key] = item.title;
      this.#leafItems.push({ ...item, link: result.link });

      // the fist note as entry point of the sidebar is the default behaviour
      // to get the opposite behaviour (last note as entry point), set the landIntoLastPage prop on side
      if (landIntoLastPage || !this.#sidebarLeafLinks[navKey])
        this.#sidebarLeafLinks[navKey] = result.link;

      this.redirects[item.guid] = `/eniblog/${item.key}`;
    } else {
      result.items = [];
      childItems.forEach(childItem => {
        //const groupsCollapsedChild = false; //groups can be collapsed only on first level of sidebar
        result.items.push(this.#traverseAfterSideItem(childItem, navKey, landIntoLastPage));
      });

      this.srcExclude.push(item.relativeFilePath);
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

  #setHomeCards() {
    const lastCreatedItems = this.#leafItems
      .sort((a, b) => b.createdTimestamp - a.createdTimestamp)
      .slice(0, 4);
    const lastCreatedCards = this.#getHomeCards(lastCreatedItems, true);

    const lastUpdatedItems = this.#leafItems
      .filter(x => !lastCreatedItems.some(y => y.key === x.key)) //exclude newly created items
      .sort((a, b) => b.updatedTimestamp - a.updatedTimestamp)
      .slice(0, 4);
    const lastUpdatedCards = this.#getHomeCards(lastUpdatedItems, false);
    this.homeCards = lastCreatedCards.concat(lastUpdatedCards);
  }

  #getHomeCards(lastItems, isNew) {
    const results = [];

    lastItems.forEach(item => {
      const fcontent = fs.readFileSync(item.relativeFilePath, 'utf-8');

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

    const options = { day: '2-digit', month: '2-digit', year: 'numeric' };
    const formatDate = (date) => date.toLocaleDateString("it-IT", options);
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
