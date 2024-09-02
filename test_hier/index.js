const dendronCache = JSON.parse(fs.readFileSync('notes/.dendron.cache.json', 'utf-8'));

const flatStructure = Object.keys(dendronCache.notes).filter(x => x !== 'root');
console.log('flatStructure');
console.log(flatStructure);

const hierStructure = buildHierStructure(flatStructure);
console.log('hierStructure');

//console.dir(hierStructure, { depth: null });

function buildHierStructure(flatStructure) {
  const root = [];

  flatStructure.forEach(path => {
    const parts = path.split('.');
    let currentLevel = root;

    parts.forEach((part, index) => {
      let existingPath = currentLevel.find(item => item.relPath === part);

      if (!existingPath) {
        existingPath = {
          relPath: part,
          fullPath: parts.slice(0, index + 1).join('.'),
          items: []
        };
        currentLevel.push(existingPath);
      }

      currentLevel = existingPath.items;
    });
  });

  return root;
}