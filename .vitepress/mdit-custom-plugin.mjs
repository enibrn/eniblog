import matter from 'gray-matter';

const mditCustomPluginFn = (md) => {
  const defaultRender = md.render;

  md.render = (src, env) => {
    //exclude homepage from this custom behavior
    if (env.path.includes('index.md'))
      return defaultRender.call(md, src, env);

    const { data, content } = matter(src);

    const titleHeader = `# ${data.title}\n\n`;
    const newContent = titleHeader + content;

    //recombine frontmatter data and content
    src = matter.stringify(newContent, data);
    return defaultRender.call(md, src, env);
  };
};

export default mditCustomPluginFn;