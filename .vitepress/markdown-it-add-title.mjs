import matter from 'gray-matter';

const addTitlePluginFn = (md) => {
  const defaultRender = md.render;

  md.render = (src, env) => {
    const { data, content } = matter(src);

    // todo dates in bagdes
    if (env.path && !env.path.includes('index.md') && data.title) {
      const titleHeader = `# ${data.title}\n\n`;
      src = titleHeader + content;
    }

    return defaultRender.call(md, src, env);
  };
};

export default addTitlePluginFn;