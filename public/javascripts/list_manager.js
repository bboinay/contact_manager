const ListManager = {
  search(collection, textString, tagString) {
    let tagMatches = this.searchTags(collection, tagString);
    let allMatches = this.searchText(tagMatches, textString);
    return allMatches;
  },

  searchText(collection, textString) {
    if (textString === '') { return collection; }
    const propertiesToSearch = ['full_name', 'email', 'phone_number'];

    let results = [];
    collection.forEach(item => {
      let thisMatches = false;
      propertiesToSearch.forEach(property => {
        if (item[property].toLowerCase().includes(textString.toLowerCase())
        ) {
          thisMatches = true;
        }
      });
      if (thisMatches) {
        results.push(item);
      }
    });

    return results;
  },

  searchTags(collection, tagString) {
    if (tagString === '') { return collection; }

    let searchTags = this.stringToArray(tagString);
    let results = [];
    collection.forEach(item => {
      let itemTags = this.stringToArray(item.tags).map(tag => tag.toLowerCase());
      if (searchTags.every(searchTag => itemTags.includes(searchTag))) {
        results.push(item);
      }
    });

    return results;
  },

  stringToArray(tagString) {
    let tags = tagString.split(',').map(str => str.trim().toLowerCase());
    return this.uniqueArray(tags).filter(tag => tag.length !== 0);
  },

  uniqueArray(array) {
    let uniques = [];
    array.forEach(item => {
      if(!uniques.includes(item)) {
        uniques.push(item);
      }
    });

    return uniques;
  },

  // collection has a 'tags' property consisting of comma separated tag strings
  allTags(collection) {
    let uniqueTags = [];
    collection.forEach(item => {
      let itemTags = this.stringToArray(item.tags);
      itemTags.forEach(itemTag => {
        if (!uniqueTags.includes(itemTag)) {
          uniqueTags.push(itemTag);
        }
      });
    });

    return uniqueTags;
  }
}
