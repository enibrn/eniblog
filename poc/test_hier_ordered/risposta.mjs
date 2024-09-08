const originalStructure = {
  "windows": {
      "title": "Microsoft Windows",
      "order": 1
  },
  "linux": {
      "title": "GNU/Linux",
      "order": 2
  },
  "macos": {
      "title": "Apple macOS",
      "order": 3
  }
};

const newArray = Object.keys(originalStructure).map(key => {
  return {
      id: key,
      title: originalStructure[key].title,
      order: originalStructure[key].order
  };
});

console.log(newArray);